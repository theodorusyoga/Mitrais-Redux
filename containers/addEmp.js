import React from 'react';
import { connect } from 'react-redux';
import { addEmp, editEmp } from '../actions';
import request from 'superagent';

var firstname;
var midname;
var surname;
var genderMale;
var genderFemale;
var birth;
var id;
var currentid;

class AddEmp extends React.Component {

    componentDidMount() {
        this.getData();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.detail.id != currentid || nextProps.detail.id == null;
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.detail != null) {
            //ini semacam ontextchanged
            console.log('updated!')

            let { detail } = nextProps
            currentid = detail.id
            id.value = detail.id
            firstname.value = detail.firstname
            midname.value = detail.midname
            surname.value = detail.surname
            birth.value = detail.birth

            if (detail.gender == 'Male') {
                genderMale.checked = true;
                genderFemale.removeAttribute('checked')
            }
            else {
                genderFemale.checked = true;
                genderMale.removeAttribute('checked')
            }
        }
    }

    getData() {
        const { dispatch } = this.props

        request
            .get('http://localhost:5000/api')
            .end((err, res) => {
                if (err) {
                    return;
                }
                const data = JSON.parse(res.text);
                let i = 0;
                NProgress.start();
                data.map(item =>
                    setTimeout(() => {
                        NProgress.set(i / data.length);
                        dispatch(addEmp(item))
                        i++;
                        if (i / data.length == 1)
                            NProgress.done();
                    }, 0)

                )


            })
    }
    create(obj, dispatch) {
        NProgress.inc();
        NProgress.inc();
        NProgress.inc();
        var url;
        var data = {
            FirstName: obj.firstname,
            MidName: obj.midname,
            LastName: obj.surname,
            Gender: obj.gender,
            BirthDate: obj.birth
        };
        if (obj.id != undefined && obj.id != null && obj.id != '') {
            url = 'http://localhost:5000/update';
            data.ID = obj.id
        }
        else {
            url = 'http://localhost:5000/create';
        }

        request
            .post(url)
            .send(data)
            .type('form')
            .end(function (err, res) {
                if (err || !res.ok) {
                    alert("There's an error while processing employee data");
                } else {
                    let data = res.body;
                    var emp = {};
                    obj['id'] = data.id;
                    if (url.indexOf('update') > 0) {
                        emp = editEmp(obj);
                    }

                    else {
                        emp = addEmp(obj)
                    }


                    dispatch(emp);  
                    NProgress.done();
                }
            });
    }

    render() {
        const { dispatch, detail, onClearForm, onInputChanged } = this.props
        const { gender } = detail;
        var style = {
            marginTop: '-7px'
        }
        return (
            <div id="form-add" className="col-md-12 col-sm-12 col-xs-12">

                <input type="hidden" ref={(node) =>
                    id = node} />
                {(id != null ?
                    (id.value != '' ?
                        <div className="form-group">
                            <div className="alert alert-info"><span className="glyphicon glyphicon-info-sign"></span> You're editing employee with ID: {id.value}
                                <button className="pull-right btn btn-danger" onClick={onClearForm} style={style}><span className="glyphicon glyphicon-remove"></span> <small>Clear editing field</small></button></div>

                        </div> : '') : ''
                )}
                <div className="x_panel">

                    <div className="x_content">
                        <br />
                        <form id="demo-form2"
                            onSubmit={(e) => {
                                e.preventDefault()
                                //assigning reference values
                                // firstname = this.refs.firstname;
                                // midname = this.refs.midname;
                                // surname = this.refs.surname;
                                // genderMale = this.refs.genderMale;
                                // genderFemale = this.refs.genderFemale;
                                // birth = this.refs.birth;
                                // id = this.refs.id;
                                if (!firstname.value.trim() || !surname.value.trim()
                                    || !birth.value.trim()) {
                                    alert("Please complete your details!");
                                    return;
                                }
                                if (!genderFemale.checked && !genderMale.checked) {
                                    alert('Please complete your gender!');
                                    return;
                                }

                                let genderval = '';
                                if (genderFemale.checked) {
                                    genderval = 'Female'
                                }
                                else {
                                    genderval = 'Male'
                                }

                                let obj = {
                                    firstname: firstname.value,
                                    midname: midname.value,
                                    surname: surname.value,
                                    gender: genderval,
                                    birth: birth.value
                                }
                                if (id.value != null && id.value != undefined && id.value != '')
                                    obj.id = id.value;
                                this.create(obj, dispatch)
                                //  this.setRefs('', '', '', '', '', '')
                                dispatch({ type: 'CLEAR_FORM' })
                                // firstname.value =
                                //     midname.value = surname.value = gender.value = birth.value = '';
                            } }
                            data-parsley-validate className="form-horizontal form-label-left">


                            <div className="form-group">
                                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">First Name <span className="required">*</span>
                                </label>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <input ref={(node) =>
                                        firstname = node} type="text" id="first-name" required="required" className="form-control col-md-7 col-xs-12"
                                        />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="last-name">Last Name <span className="required">*</span>
                                </label>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <input ref={(node) =>
                                        surname = node} type="text" id="last-name" name="last-name" required="required" className="form-control col-md-7 col-xs-12"
                                        />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="middle-name" className="control-label col-md-3 col-sm-3 col-xs-12">Middle Name / Initial</label>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <input ref={(node) =>
                                        midname = node} id="middle-name" className="form-control col-md-7 col-xs-12" type="text" name="middle-name"
                                        />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-md-3 col-sm-3 col-xs-12">Gender</label>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div id="gender" className="btn-group" data-toggle="buttons">
                                        <label className={gender == 'Male' ? 'btn btn-default active' : 'btn btn-default'} data-toggle-className="btn-primary" data-toggle-passive-className="btn-default">
                                            <input ref={(node) =>
                                                genderMale = node} type="radio" id="male" name="gender" value="Male" checked={gender == 'Male' ? true : false} /> &nbsp; Male &nbsp;
                            </label>
                                        <label className={gender == 'Female' ? 'btn btn-default active' : 'btn btn-default'} data-toggle-className="btn-primary" data-toggle-passive-className="btn-default">
                                            <input ref={(node) =>
                                                genderFemale = node} type="radio" name="gender" id="female" value="Female" checked={gender == 'Female' ? true : false} /> Female
                            </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-md-3 col-sm-3 col-xs-12">Date Of Birth <span className="required">*</span>
                                </label>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <input ref={(node) =>
                                        birth = node} id="birthday" className="date-picker form-control col-md-7 col-xs-12" required="required" type="text"
                                        />
                                </div>
                            </div>
                            <div className="ln_solid"></div>
                            <div className="form-group">
                                <div className="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                    <button type="submit" className="btn btn-primary">Cancel</button>
                                    <button type="submit" className="btn btn-success">Submit</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        detail: state.detail
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        onClearForm: () => {
            if (confirm('Do you want to clear the editing field?'))
                dispatch({ type: 'CLEAR_FORM' })
        },
        // onInputChanged: (e) =>{
        //     var targetid = e.target.id;
        //     switch(targetid){
        //         case 'first-name':
        //             firstname = e.target.value;
        //             break;
        //         case 'last-name':
        //             surname = e.target.value;
        //               break;
        //         case 'middle-name':
        //             midname = e.target.value;
        //               break;
        //         case 'birthday':
        //             birth = e.target.value;
        //               break;
        //     }
        // }
    }
}

AddEmp = connect(mapStateToProps, mapDispatchToProps)(AddEmp);

export default AddEmp;