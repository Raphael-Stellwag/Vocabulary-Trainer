import {VocabularyService} from '../../services/vocabulary.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Vocabulary} from '../../interfaces/vocabulary';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {DialogChangeRemoveBottomSheetComponent} from '../../dialogs/dialog-change-remove-bottom-sheet/dialog-change-remove-bottom-sheet.component';
import {LoadingSpinnerComponent} from 'src/app/frames/loading-spinner/loading-spinner.component';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

@Component({
    selector: 'app-site-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SiteSearchComponent implements OnInit, OnDestroy {
    vocServiceObject;
    filteredVocs: Vocabulary[];

    constructor(public vocService: VocabularyService, private bottomSheet: MatBottomSheet, private overlay: Overlay) {
    }

    ngOnInit() {
        let overlayRef;

        setTimeout(() => {
            overlayRef = this.overlay.create({height: '100%', width: '100%'});
            const userProfilePortal = new ComponentPortal(LoadingSpinnerComponent);
            overlayRef.attach(userProfilePortal);
        });

        this.vocService.getAllVocsWithUpdates().then((result) => {
            this.vocServiceObject = result;
            this.filteredVocs = [...result.data];

            if (overlayRef !== undefined) {
                overlayRef.dispose();
            }
            setTimeout(() => {
                if (overlayRef !== undefined) {
                    overlayRef.dispose();
                }
            }, 100);
        });

        const editable = document.getElementById('SearchText');
        if (editable.addEventListener) {
            editable.addEventListener('input', evt => this.filterItems(evt), false);
        }

    }

    ngOnDestroy() {
        this.vocService.removeFilteredDataObject(this.vocServiceObject);
    }

    filterItems(evt): void {
        let searchText = document.getElementById('SearchText').innerHTML;

        //Firefox Bug Fix
        if (searchText.includes('<br>')) {
            searchText = searchText.replace('<br>', '');
        }

        if (searchText === '') {
            this.filteredVocs = this.vocServiceObject.data;
            return;
        }

        const newFilteredVocs: Vocabulary[] = [];
        searchText = searchText.toUpperCase();
        for (const voc of this.vocServiceObject.data) {
            if (voc.primary_language.toUpperCase().includes(searchText) || voc.secondary_language.toUpperCase().includes(searchText)) {
                newFilteredVocs.push(voc);
            }
        }
        this.filteredVocs = newFilteredVocs;

    }

    vocPressed(voc) {
        const bottomSheetRef = this.bottomSheet.open(DialogChangeRemoveBottomSheetComponent, {
            data: voc
        });


        bottomSheetRef.afterDismissed().toPromise().then(deleted => {
            if (deleted) {
                this.filterItems(null);
            }
        });

    }

}
