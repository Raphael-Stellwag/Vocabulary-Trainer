import { NavigationEnd } from '@angular/router';
import { AfterViewInit, Component, Input, OnInit, ViewChildren } from '@angular/core';
import { LocalStorageNamespace } from '../../services/local-storage.namespace';


@Component({
  selector: 'app-var-secondary-language',
  templateUrl: './var-secondary-language.component.html',
  styleUrls: ['./var-secondary-language.component.css']
})
export class VarSecondaryLanguageComponent implements OnInit, AfterViewInit {
  secondaryLanguage: string;
  @Input() editable: boolean = false;
  @ViewChildren('secondaryLanguage') editableDiv;

  constructor() { }

  ngOnInit(): void {
    this.secondaryLanguage = LocalStorageNamespace.getSecondaryLanguage();
    document.addEventListener(LocalStorageNamespace.localStorageSecondaryLanguageKey, function (e) {
      this.secondaryLanguage = LocalStorageNamespace.getSecondaryLanguage();
    });
  }

  ngAfterViewInit() {
    if (this.editable) {
      this.editableDiv.first.nativeElement.innerText = this.secondaryLanguage;
    }
  }

  /**
   * getSecondaryLanguage
   */
  public getSecondaryLanguage() {
    if (this.editable) {
      return this.editableDiv.first.nativeElement.innerText;
    } else {
      return this.secondaryLanguage;
    }
  }
}
