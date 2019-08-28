import React, { useContext, useEffect } from "react";
import { IActivity } from "models/Activities";
import { getActivities, setActivity } from "utilities/storage";
import { http, fetchActivity } from "utilities/api";
import _ from "lodash";
import "scss/index.scss";

import {
  ActivitiesContext,
  ActivitiesProvider
} from "context/ActivitiesContext";

const Test: React.FC = () => {
  const { state, dispatch } = useContext(ActivitiesContext);
  useEffect(() => {
    fetchActivity().then(activity => {
      setTimeout(() => {
        dispatch({ type: "add", payload: activity });
        setActivity(activity);
      }, 1500);
    });
  }, []);
  return (
    <>
      {_.map(state.activities, (item, index) => (
        <div key={index}>
          {index} - {item.activity}
        </div>
      ))}
    </>
  );
};

const App: React.FC = () => {
  let activities = getActivities();
  return (
    <>
      <ActivitiesProvider initialState={{ activities }}>
        <Test />
      </ActivitiesProvider>
    </>
  );
};

export default App;
