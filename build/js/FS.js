import { ApiError, ErrorCode } from './api_error';
import { FileFlag } from './file_flag';
import * as path from 'path';
import Stats from './node_fs_stats';
/**
 * Wraps a callback function. Used for unit testing. Defaults to a NOP.
 */
let wrapCb = function (cb, numArgs) {
    return cb;
};
function normalizeMode(mode, def) {
    switch (typeof mode) {
        case 'number':
            // (path, flag, mode, cb?)
            return mode;
        case 'string':
            // (path, flag, modeString, cb?)
            let trueMode = parseInt(mode, 8);
            if (!isNaN(trueMode)) {
                return trueMode;
            }
            // Invalid string.
            return def;
        default:
            return def;
    }
}
function normalizeTime(time) {
    if (time instanceof Date) {
        return time;
    }
    else if (typeof time === 'number') {
        return new Date(time * 1000);
    }
    else {
        throw new ApiError(ErrorCode.EINVAL, `Invalid time.`);
    }
}
function normalizePath(p) {
    // Node doesn't allow null characters in paths.
    if (p.indexOf('\u0000') >= 0) {
        throw new ApiError(ErrorCode.EINVAL, 'Path must be a string without null bytes.');
    }
    else if (p === '') {
        throw new ApiError(ErrorCode.EINVAL, 'Path must not be empty.');
    }
    return path.resolve(p);
}
function normalizeOptions(options, defEnc, defFlag, defMode) {
    switch (typeof options) {
        case 'object':
            return {
                encoding: typeof options['encoding'] !== 'undefined' ? options['encoding'] : defEnc,
                flag: typeof options['flag'] !== 'undefined' ? options['flag'] : defFlag,
                mode: normalizeMode(options['mode'], defMode)
            };
        case 'string':
            return {
                encoding: options,
                flag: defFlag,
                mode: defMode
            };
        default:
            return {
                encoding: defEnc,
                flag: defFlag,
                mode: defMode
            };
    }
}
// The default callback is a NOP.
function nopCb() {
    // NOP.
}
/**
 * The node frontend to all filesystems.
 * This layer handles:
 *
 * * Sanity checking inputs.
 * * Normalizing paths.
 * * Resetting stack depth for asynchronous operations which may not go through
 *   the browser by wrapping all input callbacks using `setImmediate`.
 * * Performing the requested operation through the filesystem or the file
 *   descriptor, as appropriate.
 * * Handling optional arguments and setting default arguments.
 * @see http://nodejs.org/api/fs.html
 * @class
 */
export default class FS {
    constructor() {
        /* tslint:enable:variable-name */
        this.F_OK = 0;
        this.R_OK = 4;
        this.W_OK = 2;
        this.X_OK = 1;
        this.root = null;
        this.fdMap = {};
        this.nextFd = 100;
    }
    initialize(rootFS) {
        if (!rootFS.constructor.isAvailable()) {
            throw new ApiError(ErrorCode.EINVAL, 'Tried to instantiate BrowserFS with an unavailable file system.');
        }
        return this.root = rootFS;
    }
    /**
     * converts Date or number to a fractional UNIX timestamp
     * Grabbed from NodeJS sources (lib/fs.js)
     */
    _toUnixTimestamp(time) {
        if (typeof time === 'number') {
            return time;
        }
        else if (time instanceof Date) {
            return time.getTime() / 1000;
        }
        throw new Error("Cannot parse time: " + time);
    }
    /**
     * **NONSTANDARD**: Grab the FileSystem instance that backs this API.
     * @return [BrowserFS.FileSystem | null] Returns null if the file system has
     *   not been initialized.
     */
    getRootFS() {
        if (this.root) {
            return this.root;
        }
        else {
            return null;
        }
    }
    // FILE OR DIRECTORY METHODS
    /**
     * Asynchronous rename. No arguments other than a possible exception are given
     * to the completion callback.
     * @param [String] oldPath
     * @param [String] newPath
     * @param [Function(BrowserFS.ApiError)] callback
     */
    rename(oldPath, newPath, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            this.root.rename(normalizePath(oldPath), normalizePath(newPath), newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous rename.
     * @param [String] oldPath
     * @param [String] newPath
     */
    renameSync(oldPath, newPath) {
        this.root.renameSync(normalizePath(oldPath), normalizePath(newPath));
    }
    /**
     * Test whether or not the given path exists by checking with the file system.
     * Then call the callback argument with either true or false.
     * @example Sample invocation
     *   fs.exists('/etc/passwd', function (exists) {
     *     util.debug(exists ? "it's there" : "no passwd!");
     *   });
     * @param [String] path
     * @param [Function(Boolean)] callback
     */
    exists(path, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            return this.root.exists(normalizePath(path), newCb);
        }
        catch (e) {
            // Doesn't return an error. If something bad happens, we assume it just
            // doesn't exist.
            return newCb(false);
        }
    }
    /**
     * Test whether or not the given path exists by checking with the file system.
     * @param [String] path
     * @return [boolean]
     */
    existsSync(path) {
        try {
            return this.root.existsSync(normalizePath(path));
        }
        catch (e) {
            // Doesn't return an error. If something bad happens, we assume it just
            // doesn't exist.
            return false;
        }
    }
    /**
     * Asynchronous `stat`.
     * @param [String] path
     * @param [Function(BrowserFS.ApiError, BrowserFS.node.fs.Stats)] callback
     */
    stat(path, cb = nopCb) {
        let newCb = wrapCb(cb, 2);
        try {
            return this.root.stat(normalizePath(path), false, newCb);
        }
        catch (e) {
            return newCb(e, null);
        }
    }
    /**
     * Synchronous `stat`.
     * @param [String] path
     * @return [BrowserFS.node.fs.Stats]
     */
    statSync(path) {
        return this.root.statSync(normalizePath(path), false);
    }
    /**
     * Asynchronous `lstat`.
     * `lstat()` is identical to `stat()`, except that if path is a symbolic link,
     * then the link itself is stat-ed, not the file that it refers to.
     * @param [String] path
     * @param [Function(BrowserFS.ApiError, BrowserFS.node.fs.Stats)] callback
     */
    lstat(path, cb = nopCb) {
        let newCb = wrapCb(cb, 2);
        try {
            return this.root.stat(normalizePath(path), true, newCb);
        }
        catch (e) {
            return newCb(e, null);
        }
    }
    /**
     * Synchronous `lstat`.
     * `lstat()` is identical to `stat()`, except that if path is a symbolic link,
     * then the link itself is stat-ed, not the file that it refers to.
     * @param [String] path
     * @return [BrowserFS.node.fs.Stats]
     */
    lstatSync(path) {
        return this.root.statSync(normalizePath(path), true);
    }
    truncate(path, arg2 = 0, cb = nopCb) {
        let len = 0;
        if (typeof arg2 === 'function') {
            cb = arg2;
        }
        else if (typeof arg2 === 'number') {
            len = arg2;
        }
        let newCb = wrapCb(cb, 1);
        try {
            if (len < 0) {
                throw new ApiError(ErrorCode.EINVAL);
            }
            return this.root.truncate(normalizePath(path), len, newCb);
        }
        catch (e) {
            return newCb(e);
        }
    }
    /**
     * Synchronous `truncate`.
     * @param [String] path
     * @param [Number] len
     */
    truncateSync(path, len = 0) {
        if (len < 0) {
            throw new ApiError(ErrorCode.EINVAL);
        }
        return this.root.truncateSync(normalizePath(path), len);
    }
    /**
     * Asynchronous `unlink`.
     * @param [String] path
     * @param [Function(BrowserFS.ApiError)] callback
     */
    unlink(path, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            return this.root.unlink(normalizePath(path), newCb);
        }
        catch (e) {
            return newCb(e);
        }
    }
    /**
     * Synchronous `unlink`.
     * @param [String] path
     */
    unlinkSync(path) {
        return this.root.unlinkSync(normalizePath(path));
    }
    open(path, flag, arg2, cb = nopCb) {
        let mode = normalizeMode(arg2, 0x1a4);
        cb = typeof arg2 === 'function' ? arg2 : cb;
        let newCb = wrapCb(cb, 2);
        try {
            this.root.open(normalizePath(path), FileFlag.getFileFlag(flag), mode, (e, file) => {
                if (file) {
                    newCb(e, this.getFdForFile(file));
                }
                else {
                    newCb(e);
                }
            });
        }
        catch (e) {
            newCb(e, null);
        }
    }
    /**
     * Synchronous file open.
     * @see http://www.manpagez.com/man/2/open/
     * @param [String] path
     * @param [String] flags
     * @param [Number?] mode defaults to `0644`
     * @return [BrowserFS.File]
     */
    openSync(path, flag, mode = 0x1a4) {
        return this.getFdForFile(this.root.openSync(normalizePath(path), FileFlag.getFileFlag(flag), normalizeMode(mode, 0x1a4)));
    }
    readFile(filename, arg2 = {}, cb = nopCb) {
        let options = normalizeOptions(arg2, null, 'r', null);
        cb = typeof arg2 === 'function' ? arg2 : cb;
        let newCb = wrapCb(cb, 2);
        try {
            let flag = FileFlag.getFileFlag(options['flag']);
            if (!flag.isReadable()) {
                return newCb(new ApiError(ErrorCode.EINVAL, 'Flag passed to readFile must allow for reading.'));
            }
            return this.root.readFile(normalizePath(filename), options.encoding, flag, newCb);
        }
        catch (e) {
            return newCb(e, null);
        }
    }
    readFileSync(filename, arg2 = {}) {
        let options = normalizeOptions(arg2, null, 'r', null);
        let flag = FileFlag.getFileFlag(options.flag);
        if (!flag.isReadable()) {
            throw new ApiError(ErrorCode.EINVAL, 'Flag passed to readFile must allow for reading.');
        }
        return this.root.readFileSync(normalizePath(filename), options.encoding, flag);
    }
    writeFile(filename, data, arg3 = {}, cb = nopCb) {
        let options = normalizeOptions(arg3, 'utf8', 'w', 0x1a4);
        cb = typeof arg3 === 'function' ? arg3 : cb;
        let newCb = wrapCb(cb, 1);
        try {
            let flag = FileFlag.getFileFlag(options.flag);
            if (!flag.isWriteable()) {
                return newCb(new ApiError(ErrorCode.EINVAL, 'Flag passed to writeFile must allow for writing.'));
            }
            return this.root.writeFile(normalizePath(filename), data, options.encoding, flag, options.mode, newCb);
        }
        catch (e) {
            return newCb(e);
        }
    }
    writeFileSync(filename, data, arg3) {
        let options = normalizeOptions(arg3, 'utf8', 'w', 0x1a4);
        let flag = FileFlag.getFileFlag(options.flag);
        if (!flag.isWriteable()) {
            throw new ApiError(ErrorCode.EINVAL, 'Flag passed to writeFile must allow for writing.');
        }
        return this.root.writeFileSync(normalizePath(filename), data, options.encoding, flag, options.mode);
    }
    appendFile(filename, data, arg3, cb = nopCb) {
        let options = normalizeOptions(arg3, 'utf8', 'a', 0x1a4);
        cb = typeof arg3 === 'function' ? arg3 : cb;
        let newCb = wrapCb(cb, 1);
        try {
            let flag = FileFlag.getFileFlag(options.flag);
            if (!flag.isAppendable()) {
                return newCb(new ApiError(ErrorCode.EINVAL, 'Flag passed to appendFile must allow for appending.'));
            }
            this.root.appendFile(normalizePath(filename), data, options.encoding, flag, options.mode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    appendFileSync(filename, data, arg3) {
        let options = normalizeOptions(arg3, 'utf8', 'a', 0x1a4);
        let flag = FileFlag.getFileFlag(options.flag);
        if (!flag.isAppendable()) {
            throw new ApiError(ErrorCode.EINVAL, 'Flag passed to appendFile must allow for appending.');
        }
        return this.root.appendFileSync(normalizePath(filename), data, options.encoding, flag, options.mode);
    }
    // FILE DESCRIPTOR METHODS
    /**
     * Asynchronous `fstat`.
     * `fstat()` is identical to `stat()`, except that the file to be stat-ed is
     * specified by the file descriptor `fd`.
     * @param [BrowserFS.File] fd
     * @param [Function(BrowserFS.ApiError, BrowserFS.node.fs.Stats)] callback
     */
    fstat(fd, cb = nopCb) {
        let newCb = wrapCb(cb, 2);
        try {
            let file = this.fd2file(fd);
            file.stat(newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `fstat`.
     * `fstat()` is identical to `stat()`, except that the file to be stat-ed is
     * specified by the file descriptor `fd`.
     * @param [BrowserFS.File] fd
     * @return [BrowserFS.node.fs.Stats]
     */
    fstatSync(fd) {
        return this.fd2file(fd).statSync();
    }
    /**
     * Asynchronous close.
     * @param [BrowserFS.File] fd
     * @param [Function(BrowserFS.ApiError)] callback
     */
    close(fd, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            this.fd2file(fd).close((e) => {
                if (!e) {
                    this.closeFd(fd);
                }
                newCb(e);
            });
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous close.
     * @param [BrowserFS.File] fd
     */
    closeSync(fd) {
        this.fd2file(fd).closeSync();
        this.closeFd(fd);
    }
    ftruncate(fd, arg2, cb = nopCb) {
        let length = typeof arg2 === 'number' ? arg2 : 0;
        cb = typeof arg2 === 'function' ? arg2 : cb;
        let newCb = wrapCb(cb, 1);
        try {
            let file = this.fd2file(fd);
            if (length < 0) {
                throw new ApiError(ErrorCode.EINVAL);
            }
            file.truncate(length, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous ftruncate.
     * @param [BrowserFS.File] fd
     * @param [Number] len
     */
    ftruncateSync(fd, len = 0) {
        let file = this.fd2file(fd);
        if (len < 0) {
            throw new ApiError(ErrorCode.EINVAL);
        }
        file.truncateSync(len);
    }
    /**
     * Asynchronous fsync.
     * @param [BrowserFS.File] fd
     * @param [Function(BrowserFS.ApiError)] callback
     */
    fsync(fd, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            this.fd2file(fd).sync(newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous fsync.
     * @param [BrowserFS.File] fd
     */
    fsyncSync(fd) {
        this.fd2file(fd).syncSync();
    }
    /**
     * Asynchronous fdatasync.
     * @param [BrowserFS.File] fd
     * @param [Function(BrowserFS.ApiError)] callback
     */
    fdatasync(fd, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            this.fd2file(fd).datasync(newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous fdatasync.
     * @param [BrowserFS.File] fd
     */
    fdatasyncSync(fd) {
        this.fd2file(fd).datasyncSync();
    }
    write(fd, arg2, arg3, arg4, arg5, cb = nopCb) {
        let buffer, offset, length, position = null;
        if (typeof arg2 === 'string') {
            // Signature 1: (fd, string, [position?, [encoding?]], cb?)
            let encoding = 'utf8';
            switch (typeof arg3) {
                case 'function':
                    // (fd, string, cb)
                    cb = arg3;
                    break;
                case 'number':
                    // (fd, string, position, encoding?, cb?)
                    position = arg3;
                    encoding = typeof arg4 === 'string' ? arg4 : 'utf8';
                    cb = typeof arg5 === 'function' ? arg5 : cb;
                    break;
                default:
                    // ...try to find the callback and get out of here!
                    cb = typeof arg4 === 'function' ? arg4 : typeof arg5 === 'function' ? arg5 : cb;
                    return cb(new ApiError(ErrorCode.EINVAL, 'Invalid arguments.'));
            }
            buffer = new Buffer(arg2, encoding);
            offset = 0;
            length = buffer.length;
        }
        else {
            // Signature 2: (fd, buffer, offset, length, position?, cb?)
            buffer = arg2;
            offset = arg3;
            length = arg4;
            position = typeof arg5 === 'number' ? arg5 : null;
            cb = typeof arg5 === 'function' ? arg5 : cb;
        }
        let newCb = wrapCb(cb, 3);
        try {
            let file = this.fd2file(fd);
            if (position === undefined || position === null) {
                position = file.getPos();
            }
            file.write(buffer, offset, length, position, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    writeSync(fd, arg2, arg3, arg4, arg5) {
        let buffer, offset = 0, length, position;
        if (typeof arg2 === 'string') {
            // Signature 1: (fd, string, [position?, [encoding?]])
            position = typeof arg3 === 'number' ? arg3 : null;
            let encoding = typeof arg4 === 'string' ? arg4 : 'utf8';
            offset = 0;
            buffer = new Buffer(arg2, encoding);
            length = buffer.length;
        }
        else {
            // Signature 2: (fd, buffer, offset, length, position?)
            buffer = arg2;
            offset = arg3;
            length = arg4;
            position = typeof arg5 === 'number' ? arg5 : null;
        }
        let file = this.fd2file(fd);
        if (position === undefined || position === null) {
            position = file.getPos();
        }
        return file.writeSync(buffer, offset, length, position);
    }
    read(fd, arg2, arg3, arg4, arg5, cb = nopCb) {
        let position, offset, length, buffer, newCb;
        if (typeof arg2 === 'number') {
            // legacy interface
            // (fd, length, position, encoding, callback)
            length = arg2;
            position = arg3;
            let encoding = arg4;
            cb = typeof arg5 === 'function' ? arg5 : cb;
            offset = 0;
            buffer = new Buffer(length);
            // XXX: Inefficient.
            // Wrap the cb so we shelter upper layers of the API from these
            // shenanigans.
            newCb = wrapCb((function (err, bytesRead, buf) {
                if (err) {
                    return cb(err);
                }
                cb(err, buf.toString(encoding), bytesRead);
            }), 3);
        }
        else {
            buffer = arg2;
            offset = arg3;
            length = arg4;
            position = arg5;
            newCb = wrapCb(cb, 3);
        }
        try {
            let file = this.fd2file(fd);
            if (position === undefined || position === null) {
                position = file.getPos();
            }
            file.read(buffer, offset, length, position, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    readSync(fd, arg2, arg3, arg4, arg5) {
        let shenanigans = false;
        let buffer, offset, length, position, encoding;
        if (typeof arg2 === 'number') {
            length = arg2;
            position = arg3;
            encoding = arg4;
            offset = 0;
            buffer = new Buffer(length);
            shenanigans = true;
        }
        else {
            buffer = arg2;
            offset = arg3;
            length = arg4;
            position = arg5;
        }
        let file = this.fd2file(fd);
        if (position === undefined || position === null) {
            position = file.getPos();
        }
        let rv = file.readSync(buffer, offset, length, position);
        if (!shenanigans) {
            return rv;
        }
        else {
            return [buffer.toString(encoding), rv];
        }
    }
    /**
     * Asynchronous `fchown`.
     * @param [BrowserFS.File] fd
     * @param [Number] uid
     * @param [Number] gid
     * @param [Function(BrowserFS.ApiError)] callback
     */
    fchown(fd, uid, gid, callback = nopCb) {
        let newCb = wrapCb(callback, 1);
        try {
            this.fd2file(fd).chown(uid, gid, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `fchown`.
     * @param [BrowserFS.File] fd
     * @param [Number] uid
     * @param [Number] gid
     */
    fchownSync(fd, uid, gid) {
        this.fd2file(fd).chownSync(uid, gid);
    }
    /**
     * Asynchronous `fchmod`.
     * @param [BrowserFS.File] fd
     * @param [Number] mode
     * @param [Function(BrowserFS.ApiError)] callback
     */
    fchmod(fd, mode, cb) {
        let newCb = wrapCb(cb, 1);
        try {
            let numMode = typeof mode === 'string' ? parseInt(mode, 8) : mode;
            this.fd2file(fd).chmod(numMode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `fchmod`.
     * @param [BrowserFS.File] fd
     * @param [Number] mode
     */
    fchmodSync(fd, mode) {
        let numMode = typeof mode === 'string' ? parseInt(mode, 8) : mode;
        this.fd2file(fd).chmodSync(numMode);
    }
    /**
     * Change the file timestamps of a file referenced by the supplied file
     * descriptor.
     * @param [BrowserFS.File] fd
     * @param [Date] atime
     * @param [Date] mtime
     * @param [Function(BrowserFS.ApiError)] callback
     */
    futimes(fd, atime, mtime, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            let file = this.fd2file(fd);
            if (typeof atime === 'number') {
                atime = new Date(atime * 1000);
            }
            if (typeof mtime === 'number') {
                mtime = new Date(mtime * 1000);
            }
            file.utimes(atime, mtime, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Change the file timestamps of a file referenced by the supplied file
     * descriptor.
     * @param [BrowserFS.File] fd
     * @param [Date] atime
     * @param [Date] mtime
     */
    futimesSync(fd, atime, mtime) {
        this.fd2file(fd).utimesSync(normalizeTime(atime), normalizeTime(mtime));
    }
    // DIRECTORY-ONLY METHODS
    /**
     * Asynchronous `rmdir`.
     * @param [String] path
     * @param [Function(BrowserFS.ApiError)] callback
     */
    rmdir(path, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            path = normalizePath(path);
            this.root.rmdir(path, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `rmdir`.
     * @param [String] path
     */
    rmdirSync(path) {
        path = normalizePath(path);
        return this.root.rmdirSync(path);
    }
    /**
     * Asynchronous `mkdir`.
     * @param [String] path
     * @param [Number?] mode defaults to `0777`
     * @param [Function(BrowserFS.ApiError)] callback
     */
    mkdir(path, mode, cb = nopCb) {
        if (typeof mode === 'function') {
            cb = mode;
            mode = 0x1ff;
        }
        let newCb = wrapCb(cb, 1);
        try {
            path = normalizePath(path);
            this.root.mkdir(path, mode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `mkdir`.
     * @param [String] path
     * @param [Number?] mode defaults to `0777`
     */
    mkdirSync(path, mode) {
        this.root.mkdirSync(normalizePath(path), normalizeMode(mode, 0x1ff));
    }
    /**
     * Asynchronous `readdir`. Reads the contents of a directory.
     * The callback gets two arguments `(err, files)` where `files` is an array of
     * the names of the files in the directory excluding `'.'` and `'..'`.
     * @param [String] path
     * @param [Function(BrowserFS.ApiError, String[])] callback
     */
    readdir(path, cb = nopCb) {
        let newCb = wrapCb(cb, 2);
        try {
            path = normalizePath(path);
            this.root.readdir(path, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `readdir`. Reads the contents of a directory.
     * @param [String] path
     * @return [String[]]
     */
    readdirSync(path) {
        path = normalizePath(path);
        return this.root.readdirSync(path);
    }
    // SYMLINK METHODS
    /**
     * Asynchronous `link`.
     * @param [String] srcpath
     * @param [String] dstpath
     * @param [Function(BrowserFS.ApiError)] callback
     */
    link(srcpath, dstpath, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            srcpath = normalizePath(srcpath);
            dstpath = normalizePath(dstpath);
            this.root.link(srcpath, dstpath, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `link`.
     * @param [String] srcpath
     * @param [String] dstpath
     */
    linkSync(srcpath, dstpath) {
        srcpath = normalizePath(srcpath);
        dstpath = normalizePath(dstpath);
        return this.root.linkSync(srcpath, dstpath);
    }
    symlink(srcpath, dstpath, arg3, cb = nopCb) {
        let type = typeof arg3 === 'string' ? arg3 : 'file';
        cb = typeof arg3 === 'function' ? arg3 : cb;
        let newCb = wrapCb(cb, 1);
        try {
            if (type !== 'file' && type !== 'dir') {
                return newCb(new ApiError(ErrorCode.EINVAL, "Invalid type: " + type));
            }
            srcpath = normalizePath(srcpath);
            dstpath = normalizePath(dstpath);
            this.root.symlink(srcpath, dstpath, type, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `symlink`.
     * @param [String] srcpath
     * @param [String] dstpath
     * @param [String?] type can be either `'dir'` or `'file'` (default is `'file'`)
     */
    symlinkSync(srcpath, dstpath, type) {
        if (!type) {
            type = 'file';
        }
        else if (type !== 'file' && type !== 'dir') {
            throw new ApiError(ErrorCode.EINVAL, "Invalid type: " + type);
        }
        srcpath = normalizePath(srcpath);
        dstpath = normalizePath(dstpath);
        return this.root.symlinkSync(srcpath, dstpath, type);
    }
    /**
     * Asynchronous readlink.
     * @param [String] path
     * @param [Function(BrowserFS.ApiError, String)] callback
     */
    readlink(path, cb = nopCb) {
        let newCb = wrapCb(cb, 2);
        try {
            path = normalizePath(path);
            this.root.readlink(path, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous readlink.
     * @param [String] path
     * @return [String]
     */
    readlinkSync(path) {
        path = normalizePath(path);
        return this.root.readlinkSync(path);
    }
    // PROPERTY OPERATIONS
    /**
     * Asynchronous `chown`.
     * @param [String] path
     * @param [Number] uid
     * @param [Number] gid
     * @param [Function(BrowserFS.ApiError)] callback
     */
    chown(path, uid, gid, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            path = normalizePath(path);
            this.root.chown(path, false, uid, gid, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `chown`.
     * @param [String] path
     * @param [Number] uid
     * @param [Number] gid
     */
    chownSync(path, uid, gid) {
        path = normalizePath(path);
        this.root.chownSync(path, false, uid, gid);
    }
    /**
     * Asynchronous `lchown`.
     * @param [String] path
     * @param [Number] uid
     * @param [Number] gid
     * @param [Function(BrowserFS.ApiError)] callback
     */
    lchown(path, uid, gid, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            path = normalizePath(path);
            this.root.chown(path, true, uid, gid, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `lchown`.
     * @param [String] path
     * @param [Number] uid
     * @param [Number] gid
     */
    lchownSync(path, uid, gid) {
        path = normalizePath(path);
        this.root.chownSync(path, true, uid, gid);
    }
    /**
     * Asynchronous `chmod`.
     * @param [String] path
     * @param [Number] mode
     * @param [Function(BrowserFS.ApiError)] callback
     */
    chmod(path, mode, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            let numMode = normalizeMode(mode, -1);
            if (numMode < 0) {
                throw new ApiError(ErrorCode.EINVAL, `Invalid mode.`);
            }
            this.root.chmod(normalizePath(path), false, numMode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `chmod`.
     * @param [String] path
     * @param [Number] mode
     */
    chmodSync(path, mode) {
        let numMode = normalizeMode(mode, -1);
        if (numMode < 0) {
            throw new ApiError(ErrorCode.EINVAL, `Invalid mode.`);
        }
        path = normalizePath(path);
        this.root.chmodSync(path, false, numMode);
    }
    /**
     * Asynchronous `lchmod`.
     * @param [String] path
     * @param [Number] mode
     * @param [Function(BrowserFS.ApiError)] callback
     */
    lchmod(path, mode, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            let numMode = normalizeMode(mode, -1);
            if (numMode < 0) {
                throw new ApiError(ErrorCode.EINVAL, `Invalid mode.`);
            }
            this.root.chmod(normalizePath(path), true, numMode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `lchmod`.
     * @param [String] path
     * @param [Number] mode
     */
    lchmodSync(path, mode) {
        let numMode = normalizeMode(mode, -1);
        if (numMode < 1) {
            throw new ApiError(ErrorCode.EINVAL, `Invalid mode.`);
        }
        this.root.chmodSync(normalizePath(path), true, numMode);
    }
    /**
     * Change file timestamps of the file referenced by the supplied path.
     * @param [String] path
     * @param [Date] atime
     * @param [Date] mtime
     * @param [Function(BrowserFS.ApiError)] callback
     */
    utimes(path, atime, mtime, cb = nopCb) {
        let newCb = wrapCb(cb, 1);
        try {
            this.root.utimes(normalizePath(path), normalizeTime(atime), normalizeTime(mtime), newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Change file timestamps of the file referenced by the supplied path.
     * @param [String] path
     * @param [Date] atime
     * @param [Date] mtime
     */
    utimesSync(path, atime, mtime) {
        this.root.utimesSync(normalizePath(path), normalizeTime(atime), normalizeTime(mtime));
    }
    realpath(path, arg2, cb = nopCb) {
        let cache = typeof (arg2) === 'object' ? arg2 : {};
        cb = typeof (arg2) === 'function' ? arg2 : nopCb;
        let newCb = wrapCb(cb, 2);
        try {
            path = normalizePath(path);
            this.root.realpath(path, cache, newCb);
        }
        catch (e) {
            newCb(e);
        }
    }
    /**
     * Synchronous `realpath`.
     * @param [String] path
     * @param [Object?] cache An object literal of mapped paths that can be used to
     *   force a specific path resolution or avoid additional `fs.stat` calls for
     *   known real paths.
     * @return [String]
     */
    realpathSync(path, cache = {}) {
        path = normalizePath(path);
        return this.root.realpathSync(path, cache);
    }
    watchFile(filename, arg2, listener = nopCb) {
        throw new ApiError(ErrorCode.ENOTSUP);
    }
    unwatchFile(filename, listener = nopCb) {
        throw new ApiError(ErrorCode.ENOTSUP);
    }
    watch(filename, arg2, listener = nopCb) {
        throw new ApiError(ErrorCode.ENOTSUP);
    }
    access(path, arg2, cb = nopCb) {
        throw new ApiError(ErrorCode.ENOTSUP);
    }
    accessSync(path, mode) {
        throw new ApiError(ErrorCode.ENOTSUP);
    }
    createReadStream(path, options) {
        throw new ApiError(ErrorCode.ENOTSUP);
    }
    createWriteStream(path, options) {
        throw new ApiError(ErrorCode.ENOTSUP);
    }
    /**
     * For unit testing. Passes all incoming callbacks to cbWrapper for wrapping.
     */
    wrapCallbacks(cbWrapper) {
        wrapCb = cbWrapper;
    }
    getFdForFile(file) {
        let fd = this.nextFd++;
        this.fdMap[fd] = file;
        return fd;
    }
    fd2file(fd) {
        let rv = this.fdMap[fd];
        if (rv) {
            return rv;
        }
        else {
            throw new ApiError(ErrorCode.EBADF, 'Invalid file descriptor.');
        }
    }
    closeFd(fd) {
        delete this.fdMap[fd];
    }
}
/* tslint:disable:variable-name */
// Exported fs.Stats.
FS.Stats = Stats;
//# sourceMappingURL=FS.js.map