import React, { useContext, useEffect } from "react";
import _ from "lodash";
import "scss/index.scss";

import {
  ActivitiesContext,
  ActivitiesProvider
} from "context/ActivitiesContext";

const Test: React.FC = () => {
  const { state, dispatch } = useContext(ActivitiesContext);
  useEffect(() => {
    setTimeout(() => dispatch({ type: "add", payload: "Item" }), 1500);
  }, []);
  return (
    <>
      {_.map(state.activities, (activity, index) => (
        <div key={index}>
          {index} - {activity}
        </div>
      ))}
    </>
  );
};

const App: React.FC = () => {
  return (
    <>
      <ActivitiesProvider initialState={{ activities: ["Old Item"] }}>
        <Test />
      </ActivitiesProvider>
    </>
  );
};

export default App;
