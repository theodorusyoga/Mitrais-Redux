import React from 'react';

class Empcounter extends React.Component {
    render() {
        const { total, totalMale, totalFemale } = this.props
        return (
            <div className="row tile_count">
                <div className="col-md-4 col-sm-4 col-xs-6 tile_stats_count">
                    <span className="count_top"><i className="fa fa-user"></i> Total Employees</span>
                    <div className="count">{total}</div>
                    <span className="count_bottom"><i className="green">4% </i> From last Week</span>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-6 tile_stats_count">
                    <span className="count_top"><i className="fa fa-user"></i> Total Males</span>
                    <div className="count">{totalMale}</div>
                    <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>3% </i> From last Week</span>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-6 tile_stats_count">
                    <span className="count_top"><i className="fa fa-user"></i> Total Females</span>
                    <div className="count green">{totalFemale}</div>
                    <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>34% </i> From last Week</span>
                </div>

            </div>
        );
    }
}

Empcounter.propTypes = {
    total: React.PropTypes.number.isRequired,
    totalMale: React.PropTypes.number.isRequired,
    totalFemale: React.PropTypes.number.isRequired
}

export default Empcounter;