import { AfterViewInit, Component, Input, OnInit, ViewChildren } from '@angular/core';
import { LocalStorageNamespace } from '../../services/local-storage.namespace';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
    selector: 'app-var-primary-language',
    templateUrl: './var-primary-language.component.html',
    styleUrls: ['./var-primary-language.component.css']
})
export class VarPrimaryLanguageComponent implements OnInit, AfterViewInit {
    primaryLanguage = '';
    @Input() editable = false;
    @ViewChildren('primaryLanguage') editableDiv;

    constructor(private log: LoggingService) { }

    ngOnInit(): void {
        this.primaryLanguage = LocalStorageNamespace.getPrimaryLanguage();

        document.addEventListener(LocalStorageNamespace.localStoragePrimaryLanguageKey, function (e) {
            this.primaryLanguage = LocalStorageNamespace.getPrimaryLanguage();
        });
    }

    ngAfterViewInit() {
        if (this.editable) {
            this.editableDiv.first.nativeElement.innerText = this.primaryLanguage;
        }
    }

    /**
   * getPrimaryLanguage
   */
    public getPrimaryLanguage() {
        if (this.editable) {
            this.log.info(this.editableDiv.first.nativeElement.innerText);
            this.log.info(this.editableDiv.first.nativeElement);
            this.log.info(this.editableDiv.first.nativeElement.innerHTML);
            return this.editableDiv.first.nativeElement.innerText;
        } else {
            return this.primaryLanguage;
        }
    }

}
