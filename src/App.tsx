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

const Test: React.FC<any> = () => {
  const { state, dispatch } = useContext(ActivitiesContext);

  useEffect(() => {
    // fetchActivity().then(activity => {
    //   setTimeout(() => {
    //     dispatch({ type: "add", payload: activity });
    //     setActivityKey(activity.key);
    //   }, 1500);
    // });
  }, []);

  const resetHandler = () => {
    dispatch({ type: "cleanup" });
    removeActivitiesKeys();
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-danger text-uppercase"
        onClick={resetHandler}
      >
        Reset
      </button>

      <div className="card">
        <div className="card-header">My activities</div>
        {_.gt(_.size(state.activities), 0) && (
          <ul className="list-group list-group-flush">
            {_.map(state.activities, (activity, index) => (
              <li key={index} className="list-group-item">
                {activity.activity}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

const Loading: React.FC<any> = () => {
  return <div className="loading"></div>;
};

const Layout: React.FC<any> = ({ children }) => {
  const { dispatch } = useContext(ActivitiesContext);

  useEffect(() => {
    // fetchActivities(getActivitiesKeys()).then(activities => {
    //   dispatch({ type: "setup", payload: activities });
    // });
  }, []);

  return <main>{children}</main>;
};

const SearchContainer: React.FC<any> = () => {
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

    let params = _.pickBy(filter, _.negate(_.isNil));
    if (_.gt(_.size(params), 0)) {
      setIsLoading(true);
      setFetchedActivity(undefined);
      setFetchedError(null);

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
    }
  }, 300);

  let message;
  if (isLoading) {
    message = <Loading />;
  } else if (!_.isNil(fetchedError)) {
    message = (
      <>
        <div className="alert alert-danger" role="alert">
          {fetchedError}
        </div>
      </>
    );
  } else if (!_.isNil(fetchedActivity)) {
    message = (
      <>
        <div className="card">
          <div className="card-body">
            <div className="card-title h2">You should</div>
            <div className="card-text">{fetchedActivity.activity}</div>
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
            <div className="h2">Search Activity</div>

            <div>
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

            <button type="submit" className="btn btn-primary text-uppercase">
              Let's hit
            </button>
          </Form>
        </div>
      </div>
    </>
  );
};

const ListContainer: React.FC<any> = () => {
  return (
    <>
      <Test />
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
