import React from 'react'
import { IndexRoute, Router, Route, Link, hashHistory, browserHistory } from 'react-router'
import { addPic } from '../actions'
import request from 'superagent'
//mui
import FlatButton from 'material-ui/FlatButton'
import AppBar from 'material-ui/AppBar'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import { GridList, GridTile } from 'material-ui/GridList'
import Subheader from 'material-ui/Subheader'

require('superagent-auth-bearer')(request)


class Insta extends React.Component {
    bearer(request) {
        const { login } = this.props
        // "config" is a global var where token and other stuff resides
        let accesstoken = login.accesstoken
        if (accesstoken) {
            request.set('Authorization', 'Bearer ' + accesstoken)
        }
    }
    componentDidMount() {
        const { login, dispatch } = this.props
        let accesstoken = login.accesstoken
        dispatch({ type: 'CLEAR_PICTURES' })
        request
            .get('http://localhost:5000/api/pictures/')
            .authBearer(accesstoken)
            .end((err, res) => {
                if (err) {
                    hashHistory.push('/')
                    return;
                }
                const data = JSON.parse(res.text);
                let i = 0;
                dispatch({ type: 'STORE_PICTURES', pictures: data })
            })
    }
    render() {
        const logouticon = <FontIcon style={{ color: 'black' }} className="material-icons">exit_to_app</FontIcon>
        const settingsicon = <FontIcon style={{ color: 'black' }} className="material-icons">settings</FontIcon>
        const addicon = <FontIcon style={{ color: 'black' }} className="material-icons">add_a_photo</FontIcon>
        const addstyle = {
            position: 'absolute',
            right: '20px',
            bottom: '80px'
        }
        const { pictures, onLikeClick, onDislikeClick, onOpenClick, onLogout, login } = this.props
        let nolike = {
            color: 'white',
            marginRight: '15px',
            cursor: 'pointer'
        }
        let withlike = {
            color: '#E9573F',
            marginRight: '15px',
            cursor: 'pointer'
        }
        let logoutbtn = {
            color: '#E9573F'
        }
        const gridstyles = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
            },
            gridList: {
                width: '100%',
                height: '100%',
                overflowY: 'auto',
            },
        };

        return (
            <div className="x_content">
                <div className="row">
                    <div className="col sm-12 col-md-12 pull-right">
                        <AppBar title="FAKESTAGRAM"
                            iconElementRight={<FlatButton onTouchTap={() => onLogout()} ><span className="glyphicon glyphicon-log-out"></span>&nbsp;LOG OUT</FlatButton>}></AppBar>
                    </div>
                </div>
                <div className="row">
                    <div className="col sm-12 col-md-12">
                        <div style={gridstyles.root}>
                            <GridList cellHeight={225} padding={0} style={gridstyles.gridList}>
                                {pictures.map((pic, i) =>
                                    <GridTile key={pic.id}
                                        title={pic.desc}
                                        titlePosition="top"
                                        subtitle={pic.desc}
                                        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                                        cols={i == 0 ? 2 : 1}
                                        actionIcon={
                                            <div>
                                                <div className="row">
                                                    <div className="col-sm-6 col-md-6">
                                                        <FontIcon style={nolike} onTouchTap={() => onOpenClick(pic.id, login.accesstoken)} className="material-icons">insert_comment</FontIcon>
                                                    </div>
                                                    <div className="col-sm-6 col-md-6">
                                                        <FontIcon onTouchTap={pic.liked ? () => onDislikeClick(pic, login.accesstoken) : () => onLikeClick(pic, login.accesstoken)} style={pic.liked ? withlike : nolike} className="material-icons">favorite</FontIcon>
                                                    </div>
                                                </div>
                                                 <div className="row">
                                                    <div className="col-sm-6 col-md-6"  style={{textAlign: 'center'}}>
                                                       <small><b style={{color: 'white'}}>{pic.comments_amt}</b></small>
                                                    </div>
                                                    <div className="col-sm-6 col-md-6" style={{textAlign: 'center'}}>
                                                         <small><b style={{color: 'white'}}>{pic.likes}</b></small>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        >
                                        <img src={pic.src} />
                                    </GridTile>
                                )}
                            </GridList>
                        </div>
                    </div>
                </div>
                <div className="pull-right" style={addstyle}>
                    <FloatingActionButton>
                        {addicon}
                    </FloatingActionButton>
                </div>
                <div className="row">
                    <div className="col sm-12 col-md-12 pull-right">
                        <Paper zDepth={1}>
                            <BottomNavigation style={{ color: 'black' }}>
                                <BottomNavigationItem label={<b style={{ color: 'black' }}>SETTINGS</b>} icon={settingsicon} />
                                <BottomNavigationItem onTouchTap={() => onLogout()} label={<b style={{ color: 'black' }}>LOG OUT</b>} icon={logouticon} />
                            </BottomNavigation>
                        </Paper>
                    </div>
                </div>

            </div>
        )
    }
}

Insta.propTypes = {
    pictures: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        src: React.PropTypes.string.isRequired,
        desc: React.PropTypes.string.isRequired,
        likes: React.PropTypes.number.isRequired,
        comments_amt: React.PropTypes.number.isRequired
    }).isRequired).isRequired,
    onOpenClick: React.PropTypes.func.isRequired,
    onLikeClick: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired
};

export default Insta