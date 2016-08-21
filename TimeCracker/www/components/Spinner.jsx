import React from 'react'

export default class Spinner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var wrapperClass = "preloader-wrapper active";
        this.props.big && (wrapperClass += " big");
        return (
            <div className="center-align">
                <div className={wrapperClass}>
                    <div className="spinner-layer spinner-red-only">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div>
                        <div className="gap-patch">
                            <div className="circle"></div>
                        </div>
                        <div className="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
