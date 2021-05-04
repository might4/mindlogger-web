import React from 'react';

// Component
import Activity from '../Activity';

export const ActivityList = () => (
  <div className="container">
    <div className="row mt-5 activity">
      <div className="col-sm-24 col-xs-24 col-md-2">
        <div className="card hover" style={{ width: "10rem" }}>
          <div className="pr-4 pl-4 pt-4">
            <img src="../logo192.png" className="card-img-top rounded border w-h" alt="applet-image" />
          </div>
          <div className="card-body">
            <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </div>
      <div className="col-sm-24 col-xs-24 col-md-10">
        <Activity type="radio"/>
        <Activity type="checkbox"/>
        <Activity type="textinput"/>
      </div>
    </div>
  </div>

)

export default ActivityList;
