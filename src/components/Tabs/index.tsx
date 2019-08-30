import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { addClassName } from "utilities/functions";
import _ from "lodash";

export const Nav: React.FC<any> = ({ children }) => {
  return <nav>{children}</nav>;
};

export const NavTabs: React.FC<any> = ({ children }) => {
  return <div className="nav nav-tabs">{children}</div>;
};

export const NavItem: React.FC<any> = ({
  name,
  label,
  index,
  selectedIndex,
  doSelect
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const isActive =
    !_.isNil(index) && !_.isNil(selectedIndex) && _.eq(index, selectedIndex);

  return (
    <a
      ref={ref}
      className={`nav-item nav-link ${isActive ? "active" : ""}`}
      id={`nav-${name}-tab`}
      data-toggle="tab"
      href={`#nav-${name}`}
      role="tab"
      aria-controls={`nav-${name}`}
      aria-selected={isActive ? true : false}
      onClick={e => {
        e.preventDefault();
        if (_.isFunction(doSelect)) doSelect();
      }}
    >
      {label}
    </a>
  );
};

NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export const TabContent: React.FC<any> = ({ children }) => {
  return <div className="tab-content">{children}</div>;
};

export const TabPane: React.FC<any> = ({
  name,
  index,
  selectedIndex,
  children
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isActive =
    !_.isNil(index) && !_.isNil(selectedIndex) && _.eq(index, selectedIndex);

  const timeout = setTimeout(() => {
    if (!_.isNil(ref.current) && isActive) addClassName(ref.current, "show");
    clearTimeout(timeout);
  }, 300);

  return (
    <div
      ref={ref}
      className={`tab-pane fade ${isActive ? "active" : ""}`}
      id={`${name}`}
      role="tabpanel"
      aria-labelledby={`${name}-tab`}
    >
      {children}
    </div>
  );
};

TabPane.propTypes = {
  name: PropTypes.string.isRequired
};

export const Tabs: React.FC<any> = ({ children }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const changeSelectedIndex = (index: number) => setSelectedIndex(index);

  let _children;
  const reactCloneElementRecursive = (children: any): any =>
    React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;

      let props: any = {};
      let childName = _.get(child, ["type", "name"], null);
      let doSelect = changeSelectedIndex.bind(null, index);
      switch (childName) {
        case "NavItem":
          props = _.merge(props, { index, selectedIndex, doSelect });
          break;
        case "TabPane":
          props = _.merge(props, { index, selectedIndex });
          break;
        default:
          break;
      }
      props.children = reactCloneElementRecursive(
        _.get(child, ["props", "children"], null)
      );
      return React.cloneElement(child, props);
    });

  _children = reactCloneElementRecursive(children);
  return <>{_children}</>;
};
