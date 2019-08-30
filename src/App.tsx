import React, { useContext, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { IActivity, IActivityParams } from "models/Activities";
import {
  Tabs,
  Nav,
  NavTabs,
  NavItem,
  TabContent,
  TabPane
} from "components/Tabs";
import {
  RangeMultiple,
  SelectBox,
  SelectBoxOption,
  InputBox,
  Form
} from "components/Form";
import {
  getActivitiesKeys,
  removeActivitiesKeys,
  setActivityKey
} from "utilities/storage";
import { http, fetchActivity, fetchActivities } from "utilities/api";
import _ from "lodash";
import "scss/index.scss";

import {
  ActivitiesContext,
  ActivitiesProvider
} from "context/ActivitiesContext";

const Loading: React.FC<any> = () => {
  return <div className="loading"></div>;
};

const Layout: React.FC<any> = ({ children }) => {
  const { dispatch } = useContext(ActivitiesContext);

  useEffect(() => {
    fetchActivities(getActivitiesKeys()).then(activities => {
      dispatch({ type: "setup", payload: activities });
    });
  }, []);

  return (
    <main>
      <div className="container">
        <div className="row no-gutters">
          <div className="col-12 px-3 py-3">{children}</div>
        </div>
      </div>
    </main>
  );
};

const SearchContainer: React.FC<any> = () => {
  const { state, dispatch } = useContext(ActivitiesContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchedError, setFetchedError] = useState<string | null>(null);
  const [fetchedActivity, setFetchedActivity] = useState<IActivity | undefined>(
    undefined
  );

  const [filter, setFilter] = useState<IActivityParams>({
    type: undefined,
    participants: undefined,
    minprice: undefined,
    maxprice: undefined,
    minaccessibility: undefined,
    maxaccessibility: undefined
  });

  const hasActivity = _.some(state.activities, [
    "key",
    _.get(fetchedActivity, "key")
  ]);

  const types = [
    "education",
    "recreational",
    "social",
    "diy",
    "charity",
    "cooking",
    "relaxation",
    "music",
    "busywork"
  ];

  const changeFilter = _.debounce((params: Partial<IActivityParams>) => {
    setFilter(_.merge({}, filter, params));
  }, 300);

  const submitForm = _.throttle((event: React.SyntheticEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setFetchedActivity(undefined);
    setFetchedError(null);

    let params = _.pickBy(filter, _.negate(_.isNil));
    fetchActivity(params)
      .then(activity => {
        if (activity instanceof Error) return;
        setFetchedActivity(activity);
        setIsLoading(false);
      })
      .catch(error => {
        setFetchedError(error.message);
        setIsLoading(false);
      });
  }, 300);

  const saveActivity = _.debounce(() => {
    if (_.isNil(fetchedActivity) || hasActivity) return;
    dispatch({ type: "add", payload: fetchedActivity });
    setActivityKey(fetchedActivity.key);
  }, 300);

  let message;
  if (isLoading) {
    message = <Loading />;
  } else if (!_.isNil(fetchedError)) {
    message = (
      <>
        <div className="alert alert-danger text-center mt-3" role="alert">
          {fetchedError}
        </div>
      </>
    );
  } else if (!_.isNil(fetchedActivity)) {
    message = (
      <>
        <div className="card text-center mt-3">
          <div className="card-body">
            <div className="card-title h2">You should</div>
            <div className="card-text mb-3">{fetchedActivity.activity}</div>
            <button
              type="button"
              className="btn btn-success text-uppercase"
              disabled={hasActivity}
              onClick={saveActivity}
            >
              Push
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row no-gutters">
        <div className="col-6 px-3 py-3">{message}</div>

        <div className="col-6 px-3 py-3">
          <Form onSubmit={submitForm}>
            <div className="h2 text-center">Search Activity</div>

            <div className="mb-3">
              <div className="form-group">
                <label htmlFor="filter-type">Type</label>
                <SelectBox
                  id="filter-type"
                  className="form-control"
                  name="type"
                  onChange={($event: any) => {
                    const type = $event;
                    changeFilter({ type });
                  }}
                >
                  {_.map(types, type => (
                    <SelectBoxOption key={type} value={type}>
                      {type}
                    </SelectBoxOption>
                  ))}
                </SelectBox>
              </div>

              <div className="form-group">
                <label htmlFor="filter-participants">Participants</label>
                <InputBox
                  id="filter-participants"
                  className="form-control"
                  name="participants"
                  type="number"
                  min="0"
                  onChange={($event: any) => {
                    const participants = $event;
                    changeFilter({ participants });
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="filter-price">Price</label>
                <RangeMultiple
                  id="filter-price"
                  className="form-control-range"
                  name="price"
                  min="0"
                  max="1"
                  step="0.1"
                  onChange={($event: [number, number]) => {
                    const [minprice, maxprice] = $event;
                    changeFilter({ minprice, maxprice });
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="filter-accessibility">Accessibility</label>
                <RangeMultiple
                  id="filter-accessibility"
                  className="form-control-range"
                  name="accessibility"
                  min="0"
                  max="1"
                  step="0.1"
                  onChange={($event: [number, number]) => {
                    const [minaccessibility, maxaccessibility] = $event;
                    changeFilter({
                      minaccessibility,
                      maxaccessibility
                    });
                  }}
                />
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary text-uppercase" disabled={isLoading}>
                Let's hit
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

const MyActivities: React.FC<any> = () => {
  const { state, dispatch } = useContext(ActivitiesContext);

  const hasActivities = _.gt(_.size(state.activities), 0);

  const resetAllActivities = _.debounce(() => {
    dispatch({ type: "cleanup" });
    removeActivitiesKeys();
  }, 300);

  return (
    <>
      <div className="row no-gutters">
        <div className="col-12">
          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-danger text-uppercase"
              disabled={!hasActivities}
              onClick={resetAllActivities}
            >
              Reset
            </button>
          </div>

          <div className="card text-center mt-3">
            <div className="card-header">My activities</div>
            <ul className="list-group list-group-flush">
              {hasActivities &&
                _.map(state.activities, (activity, index) => (
                  <li key={index} className="list-group-item">
                    {activity.activity}
                  </li>
                ))}
              {!hasActivities && <li className="list-group-item text-danger">You haven't activities</li>}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const ListContainer: React.FC<any> = () => {
  return (
    <>
      <MyActivities />
    </>
  );
};

const App: React.FC<any> = () => {
  return (
    <>
      <ActivitiesProvider>
        <Layout>
          <Tabs>
            <Nav>
              <NavTabs>
                <NavItem label="Search activity" name="search" />
                <NavItem label="My activities" name="list" />
              </NavTabs>
            </Nav>
            <TabContent>
              <TabPane name="search">
                <SearchContainer />
              </TabPane>
              <TabPane name="list">
                <ListContainer />
              </TabPane>
            </TabContent>
          </Tabs>
        </Layout>
      </ActivitiesProvider>
    </>
  );
};

export default App;
