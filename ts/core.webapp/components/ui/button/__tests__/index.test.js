import React from 'react';
import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import Button from "../";
describe('core.webapp -> ui -> button', () => {
  it('renders with provided className', () => {
    expect(toJson(mount(<Button className="lorem-ipsum">Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders with provided display', () => {
    expect(toJson(mount(<Button display="inline">Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders with provided link', () => {
    expect(toJson(mount(<Button link="http://www.example.com">Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders with provided onClick event handler', () => {
    expect(toJson(mount(<Button onClick={() => null}>Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders with provided target', () => {
    expect(toJson(mount(<Button target="_blank">Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders with provided type', () => {
    expect(toJson(mount(<Button type="lorem">Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders in caps ', () => {
    expect(toJson(mount(<Button caps>Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders in disabled state ', () => {
    expect(toJson(mount(<Button disabled>Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders in loading state ', () => {
    expect(toJson(mount(<Button loading>Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders in yellow', () => {
    expect(toJson(mount(<Button yellow>Lorem ispum</Button>))).toMatchSnapshot();
  });
  it('renders', () => {
    expect(toJson(mount(<Button>Lorem ispum</Button>))).toMatchSnapshot();
  });
});