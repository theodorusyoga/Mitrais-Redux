export const addPic = (obj) => ({
    type: 'ADD_PIC',
    id: obj.id,
    src: obj.src,
    desc: obj.desc,
    likes: obj.likes,
    comments_amt: obj.comments_amt
});

export const addComment = (obj) => ({
    type: 'ADD_COMMENT',
    id: obj.id,
    text: obj.text,
    name: obj.name,
    time: obj.time
});
