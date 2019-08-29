import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

export const RangeMultiple: React.FC<any> = ({
  id,
  name,
  min,
  max,
  step,
  defaultValue,
  onChange,
  ...props
}) => {
  min = _.toNumber(_.defaultTo(min, 0));
  max = _.toNumber(_.defaultTo(max, 1));
  step = _.toNumber(_.defaultTo(step, 1));
  defaultValue = _.defaultTo(defaultValue, [min, max]);
  onChange = _.defaultTo(onChange, _.noop);

  const [value, setValue] = useState<[number, number]>([min, max]);
  const [changed, setChanged] = useState<boolean>(false);

  const defaultValueMin = _.toString(_.defaultTo(defaultValue[0], min));
  const defaultValueMax = _.toString(_.defaultTo(defaultValue[1], max));
  const tickmarks = _.range(min, max + step, step);

  const minRef = useRef<HTMLInputElement | null>(null);
  const maxRef = useRef<HTMLInputElement | null>(null);

  const _onChange = (event: React.ChangeEvent) => {
    event.stopPropagation();
    let minVal, maxVal, _minVal, _maxVal;

    minVal = _.toNumber(_.get(minRef.current, "value", min));
    maxVal = _.toNumber(_.get(maxRef.current, "value", max));

    minVal = Math.min(Math.max(minVal, min), max);
    maxVal = Math.min(Math.max(maxVal, min), max);

    _minVal = minVal;
    _maxVal = maxVal;

    if (_.gte(_minVal, _maxVal)) {
      minVal = _maxVal;
      if (!_.isNil(minRef.current)) _.set(minRef.current, "value", minVal);
    }

    if (_.lte(_maxVal, _minVal)) {
      maxVal = _minVal;
      if (!_.isNil(maxRef.current)) _.set(maxRef.current, "value", maxVal);
    }

    setValue([minVal, maxVal]);
    if (!changed) setChanged(true);
  };

  useEffect(() => {
    if (changed && _.isFunction(onChange)) onChange(value);
    // eslint-disable-next-line
  }, [value]);

  return (
    <>
      <input
        id={id}
        ref={minRef}
        type="range"
        min={min}
        max={max}
        defaultValue={defaultValueMin}
        step={step}
        list={`tickmarks-${name}`}
        multiple
        onChange={_onChange}
        {...props}
      />
      <input
        ref={maxRef}
        type="range"
        min={min}
        max={max}
        defaultValue={defaultValueMax}
        step={step}
        list={`tickmarks-${name}`}
        multiple
        onChange={_onChange}
        {...props}
      />
      <datalist id={`tickmarks-${name}`}>
        {_.map(tickmarks, (n, index) => (
          <option key={index} value={n} />
        ))}
      </datalist>
    </>
  );
};

RangeMultiple.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number)
  ]),
  onChange: PropTypes.func
};

export const SelectBox: React.FC<any> = ({
  name,
  defaultValue,
  onChange,
  multiple,
  children,
  ...props
}) => {
  const [value, setValue] = useState<any>(_.defaultTo(defaultValue, null));
  const [changed, setChanged] = useState<boolean>(false);

  const ref = useRef<HTMLSelectElement | null>(null);

  const _onChange = (event: React.ChangeEvent) => {
    event.stopPropagation();

    let index: number = _.get(ref.current, "selectedIndex", -1);
    let option: HTMLOptionElement | undefined = _.get(
      ref.current,
      ["options", index],
      undefined
    );
    let val = _.get(option, "value", defaultValue);

    setValue(val);
    if (!changed) setChanged(true);
  };

  useEffect(() => {
    if (changed && _.isFunction(onChange)) onChange(value);
    // eslint-disable-next-line
  }, [value]);

  let _children = _.map(
    _.filter(React.Children.toArray(children), child => {
      const childName = _.get(child, ["type", "name"], null);
      return (
        React.isValidElement(child) && _.isEqual(childName, "SelectBoxOption")
      );
    }),
    child => {
      let propValue = _.get(child.props, "value", null);
      let props: any = {
        selected:
          _.isEqual(propValue, value) ||
          (_.isArray(value) && _.includes(value, propValue))
      };
      return React.cloneElement(child, props);
    }
  );

  return (
    <select
      ref={ref}
      name={name}
      defaultValue={value}
      onChange={_onChange}
      multiple={multiple}
      {...props}
    >
      {_children}
    </select>
  );
};

SelectBox.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.any,
  multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onChange: PropTypes.func
};

export const SelectBoxOption: React.FC<any> = ({
  value,
  disabled,
  hidden,
  children
}) => {
  return (
    <option value={value} disabled={disabled} hidden={hidden}>
      {children}
    </option>
  );
};

SelectBoxOption.propTypes = {
  value: PropTypes.any,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export const InputBox: React.FC<any> = ({
  name,
  type,
  defaultValue,
  onChange,
  ...props
}) => {
  const [value, setValue] = useState<any>(_.defaultTo(defaultValue, null));
  const [changed, setChanged] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement | null>(null);

  const _onChange = (event: React.ChangeEvent) => {
    event.stopPropagation();
    let val = _.get(ref.current, "value", null);

    setValue(val);
    if (!changed) setChanged(true);
  };

  useEffect(() => {
    if (changed && _.isFunction(onChange)) onChange(value);
    // eslint-disable-next-line
  }, [value]);

  return (
    <input
      ref={ref}
      name={name}
      type={type}
      defaultValue={defaultValue}
      onChange={_onChange}
      {...props}
    />
  );
};

InputBox.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  defaultValue: PropTypes.any,
  onChange: PropTypes.func
};

export const Form: React.FC<any> = ({ children }) => {
  return <form>{children}</form>;
};
