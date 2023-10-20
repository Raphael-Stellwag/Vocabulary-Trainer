import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {VocabularyRestService} from './services/vocabulary-rest.service';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';
import { VocabularyService } from './services/vocabulary.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isMainMenu;
  isMobileUser;
  newUpdate: boolean = false;

  constructor(update: SwUpdate, private vocabularyService: VocabularyService, private router: Router, public snackBar: MatSnackBar, private auth: AuthService) {    
    document.ontouchstart = function(e){ 
      e.preventDefault(); 
    }

    vocabularyService.sync();

    console.info("App version: " + environment.version);

    if(screen.height > 600 && screen.width > 600) {
      this.isMobileUser = false;
    } else {
      this.isMobileUser = true;
    }

    window.onresize = () => {
      this.onresize();
    }
    
    this.router.events
    .subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        if (event.url == "/" || event.urlAfterRedirects == "/") {
          this.isMainMenu = true;
        } else {
          this.isMainMenu = false;
        }
      }
    });

    update.available.subscribe(event => {
      const snack = this.snackBar.open('Update Available', 'Reload', {duration: 5000});
      snack.onAction()
        .subscribe(() => {
          window.location.reload();
        });
    })
  }

  onresize() {
    if(this.getHeight() > 600 && this.getWidth() > 600) {
      this.isMobileUser = false;
      this.resizeElements();
    } else {
      this.isMobileUser = true;
    }
  }

  resizeElements() {
    var svgLO = document.getElementById("svgLO");
    var svgRO = document.getElementById("svgRO");
    var svgLU = document.getElementById("svgLU");
    var svgRU = document.getElementById("svgRU");
    if (svgLO != null) {
      this.resizeSVG(svgLO);
    }
    if (svgRO != null) {
      this.resizeSVG(svgRO); 
    }
    if (svgLU != null) {
      this.resizeSVG(svgLU);
    }
    if (svgRU != null) {
      this.resizeSVG(svgRU);
    }
  }
    
  resizeSVG(element) {
    let width = element.getBoundingClientRect().width
    let height = element.getBoundingClientRect().height
    let aspect_ratio = width / height;
    
    let future_width = this.getWidth()/5 - 5;
    let future_height = future_width / aspect_ratio;
    
    element.setAttribute("height", future_height+"px");
    element.setAttribute("width", future_width+"px");
  }
    
  getWidth() {
    return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
    );
  }
    
  getHeight() {
    return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
    );
  }
}
