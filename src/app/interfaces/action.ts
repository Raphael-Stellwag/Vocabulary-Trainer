import { IVocabulary } from "./vocabulary";

export interface IAction {
    id: number;
    method: ActionMethod;
    vocabularyBeforeAction: IVocabulary;
    vocabularyAfterAction: IVocabulary;
    //reverseMethod?: ActionMethod; //Only used local
}

export class Action implements IAction {
    id: number;
    method: ActionMethod;
    vocabularyBeforeAction: IVocabulary;
    vocabularyAfterAction: IVocabulary;

    constructor(id: number, method: ActionMethod, vocabularyBeforeAction:IVocabulary, vocabularyAfterAction:IVocabulary) {
        this.id = id;
        this.method = method;
        this.vocabularyBeforeAction = vocabularyBeforeAction;
        this.vocabularyAfterAction = vocabularyAfterAction;
    }

    static findReverseMethod(params:ActionMethod): ActionMethod {
        switch (params) {
            case ActionMethod.ADD:
                return ActionMethod.DELETE;
                break;
            case ActionMethod.UPDATE:
                return ActionMethod.UPDATE;
                break;
            case ActionMethod.DELETE:
                return ActionMethod.ADD;
                break;
        }
    }

    /*
    static findVocabularyId(action: Action): number {
        switch (action.method) {
            case ActionMethod.ADD:
                return action.vocabularyAfterAction.id;
                break;
            case ActionMethod.UPDATE:
                return action.vocabularyAfterAction.id;
                break;
            case ActionMethod.DELETE:
                return action.vocabularyBeforeAction.id;
                break;
        }
    }

     */

    static deserializeVocabularies(action): Action {
        if (action.vocabularyBeforeAction != null) {
            action.vocabularyBeforeAction = JSON.parse(action.vocabularyBeforeAction);
        }
        if (action.vocabularyAfterAction != null) {
            action.vocabularyAfterAction = JSON.parse(action.vocabularyAfterAction);
        }
        return action;
    }
}

export enum ActionMethod {
    ADD = "ADD",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
