import React from 'react';

class Dailyusers extends React.Component {
    render() {
        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>Daily active users <small>Sessions</small></h2>
                    <ul className="nav navbar-right panel_toolbox">
                        <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                            <ul className="dropdown-menu" role="menu">
                                <li><a href="#">Settings 1</a>
                                </li>
                                <li><a href="#">Settings 2</a>
                                </li>
                            </ul>
                        </li>
                        <li><a className="close-link"><i className="fa fa-close"></i></a>
                        </li>
                    </ul>
                    <div className="clearfix"></div>
                </div>
                <div className="x_content">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="temperature"><b>Monday</b>, 07:30 AM
                                                        <span>F</span>
                                <span><b>C</b></span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="weather-icon">
                                <canvas height="84" width="84" id="partly-cloudy-day"></canvas>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className="weather-text">
                                <h2>Texas <br /><i>Partly Cloudy Day</i></h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="weather-text pull-right">
                            <h3 className="degrees">23</h3>
                        </div>
                    </div>

                    <div className="clearfix"></div>

                    <div className="row weather-days">
                        <div className="col-sm-2">
                            <div className="daily-weather">
                                <h2 className="day">Mon</h2>
                                <h3 className="degrees">25</h3>
                                <canvas id="clear-day" width="32" height="32"></canvas>
                                <h5>15 <i>km/h</i></h5>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="daily-weather">
                                <h2 className="day">Tue</h2>
                                <h3 className="degrees">25</h3>
                                <canvas height="32" width="32" id="rain"></canvas>
                                <h5>12 <i>km/h</i></h5>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="daily-weather">
                                <h2 className="day">Wed</h2>
                                <h3 className="degrees">27</h3>
                                <canvas height="32" width="32" id="snow"></canvas>
                                <h5>14 <i>km/h</i></h5>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="daily-weather">
                                <h2 className="day">Thu</h2>
                                <h3 className="degrees">28</h3>
                                <canvas height="32" width="32" id="sleet"></canvas>
                                <h5>15 <i>km/h</i></h5>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="daily-weather">
                                <h2 className="day">Fri</h2>
                                <h3 className="degrees">28</h3>
                                <canvas height="32" width="32" id="wind"></canvas>
                                <h5>11 <i>km/h</i></h5>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="daily-weather">
                                <h2 className="day">Sat</h2>
                                <h3 className="degrees">26</h3>
                                <canvas height="32" width="32" id="cloudy"></canvas>
                                <h5>10 <i>km/h</i></h5>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dailyusers