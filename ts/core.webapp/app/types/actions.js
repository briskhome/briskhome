/** @flow */
import { User, Wizard } from "./";
import { WizardSlideState } from "../../components/wizard/types";
export type LoginAction = {
  type: "@@BRISKHOME/LOGIN";
  value: User;
};
export type LogoutAction = {
  type: "@@BRISKHOME/LOGOUT";
};
export type WizardInitAction = {
  type: "@@WIZARD/INIT";
  value: {
    state: Wizard;
  };
};
export type WizardPrevAction = {
  type: "@@WIZARD/PREV";
  value?: {
    state: WizardSlideState;
  };
};
export type WizardNextAction = {
  type: "@@WIZARD/NEXT";
  value?: {
    state: WizardSlideState;
  };
};
export type WizardGotoAction = {
  type: "@@WIZARD/GOTO";
  value: {
    slide: number;
    state?: WizardSlideState;
  };
};