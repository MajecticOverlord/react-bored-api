import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IActivity } from "models/Activities";
import {
  Tabs,
  Nav,
  NavTabs,
  NavItem,
  TabContent,
  TabPane
} from "components/Tabs";
import {
  getActivities,
  setActivity,
  removeActivities
} from "utilities/storage";
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

  const resetHandler = () => {
    dispatch({ type: "cleanUp" });
    removeActivities();
  };

  return (
    <>
      <button type="button" onClick={resetHandler}>
        Reset
      </button>
      {_.map(state.activities, (_activity, index) => (
        <div key={index}>
          {index} - {_activity.activity}
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
        <Tabs>
          <Nav>
            <NavTabs>
              <NavItem label="Search activity" name="search" />
              <NavItem label="My activities" name="list" />
            </NavTabs>
          </Nav>
          <TabContent>
            <TabPane name="search">
              <div>
                <div>
                  <div>You should</div>
                  <div>...</div>
                </div>
                <div>
                  <div>Search</div>
                  <div>
                    <div>
                      <div>Type</div>
                      <div>
                        <select>
                          {_.map(
                            [
                              "education",
                              "recreational",
                              "social",
                              "diy",
                              "charity",
                              "cooking",
                              "relaxation",
                              "music",
                              "busywork"
                            ],
                            type => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane name="list">
              <Test />
            </TabPane>
          </TabContent>
        </Tabs>
      </ActivitiesProvider>
    </>
  );
};

export default App;
