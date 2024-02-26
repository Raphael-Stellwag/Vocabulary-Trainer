import {IAction} from '../interfaces/action';

export namespace LocalStorageNamespace {
    const defaultPrimaryLanguage: string = 'German';
    export const localStoragePrimaryLanguageKey: string = 'PrimaryLanguage';
    const defaultSecondaryLanguage: string = 'English';
    export const localStorageSecondaryLanguageKey: string = 'SecondaryLanguage';
    const defaultCountSynchronisedActions: number = 0;
    const localStorageCountSynchronisedActionsKey: string = 'CountSynchronisedActions';
    const localStorageSavedActionsKey: string = 'LocalSavedActions';
    const localStoragePrimaryIdKey: string = 'PrimaryId';

    const localStorageLastSyncDateKey = 'LastSyncDate';
    const defaultLastSyncDate = new Date(0);

    export function getPrimaryLanguage() {
        let local: string = localStorage.getItem(localStoragePrimaryLanguageKey);
        if (local === null || local === undefined) {
            local = defaultPrimaryLanguage;
        }
        return local;
    }

    export function setPrimaryLanguage(newPrimaryLanguage: string) {
        localStorage.setItem(localStoragePrimaryLanguageKey, newPrimaryLanguage);
        document.dispatchEvent(new CustomEvent(LocalStorageNamespace.localStoragePrimaryLanguageKey));
    }

    export function getSecondaryLanguage() {
        let local: string = localStorage.getItem(localStorageSecondaryLanguageKey);
        if (local === null || local === undefined) {
            local = defaultSecondaryLanguage;
        }
        return local;
    }

    export function setSecondaryLanguage(newSecondaryLanguage: string) {
        localStorage.setItem(localStorageSecondaryLanguageKey, newSecondaryLanguage);
        document.dispatchEvent(new CustomEvent(LocalStorageNamespace.localStorageSecondaryLanguageKey));
    }

    export function getCountSynchronisedActions(): number {
        let local: string | number = localStorage.getItem(localStorageCountSynchronisedActionsKey);
        if (local === null || local === undefined) {
            local = defaultCountSynchronisedActions;
        } else {
            local = +local;
        }
        return local as number;
    }

    export function getLocalSavedActions(): IAction[] {
        let local: string | IAction[] = localStorage.getItem(localStorageSavedActionsKey);
        if (local === null || local === undefined) {
            local = [];//defaultSavedActions;
        } else {
            local = JSON.parse(local);
        }
        return local as IAction[];
    }

    export function setLocalSavedActions(actions: IAction[]) {
        localStorage.setItem(localStorageSavedActionsKey, JSON.stringify(actions));
    }

    export function deleteLocalSavedActions() {
        localStorage.setItem(localStorageSavedActionsKey, JSON.stringify([]/*defaultSavedActions*/));
        localStorage.removeItem(localStorageSavedActionsKey);
    }

    export function addCountSynchronizedActions(toAdd: number) {
        let newCount = getCountSynchronisedActions() + toAdd;
        localStorage.setItem(localStorageCountSynchronisedActionsKey, newCount + '');
    }

    export function setNextPrimaryId(newNumber: number) {
        localStorage.setItem(localStoragePrimaryIdKey, newNumber + '');
    }

    export function getLastSyncDate(): Date {
        const local: string = localStorage.getItem(localStorageLastSyncDateKey);
        if (local === null || local === undefined) {
            return defaultLastSyncDate;
        } else {
            return new Date(Number(local));
        }
    }

    export function setLastSyncDate(syncDate: Date) {
        localStorage.setItem(localStorageLastSyncDateKey, String(syncDate.getTime()));
    }

}
