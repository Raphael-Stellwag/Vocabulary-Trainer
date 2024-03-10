import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { VocabularyRestService } from './services/vocabulary-rest.service';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';
import { VocabularyService } from './services/vocabulary.service';
import { LoggingService } from './services/logging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    isMainMenu;
    isMobileUser;

    constructor(update: SwUpdate, vocabularyService: VocabularyService, private router: Router,
        public snackBar: MatSnackBar, authService: AuthService, log: LoggingService) {
        document.ontouchstart = function (e) {
            e.preventDefault();
        };

        authService.isLoggedIn().then(loggedIn => {
            if (loggedIn) {
                log.info("User logged in");
                vocabularyService.sync();
            } else {
                log.info("User not logged in");
            }
        })

        log.info('App version: ' + environment.version);

        if (screen.height > 600 && screen.width > 600) {
            this.isMobileUser = false;
        } else {
            this.isMobileUser = true;
        }

        window.onresize = () => {
            this.onresize();
        };

        this.router.events
            .subscribe((event) => {
                if (event instanceof RoutesRecognized) {
                    if (event.url === '/' || event.urlAfterRedirects === '/') {
                        this.isMainMenu = true;
                    } else {
                        this.isMainMenu = false;
                    }
                }
            });

        update.available.subscribe(event => {
            const snack = this.snackBar.open('Update Available', 'Reload', { duration: 5000 });
            snack.onAction()
                .subscribe(() => {
                    window.location.reload();
                });
        });
    }

    onresize() {
        if (this.getHeight() > 600 && this.getWidth() > 600) {
            this.isMobileUser = false;
            this.resizeElements();
        } else {
            this.isMobileUser = true;
        }
    }

    resizeElements() {
        const svgLO = document.getElementById('svgLO');
        const svgRO = document.getElementById('svgRO');
        const svgLU = document.getElementById('svgLU');
        const svgRU = document.getElementById('svgRU');
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
        const width = element.getBoundingClientRect().width;
        const height = element.getBoundingClientRect().height;
        const aspect_ratio = width / height;

        const future_width = this.getWidth() / 5 - 5;
        const future_height = future_width / aspect_ratio;

        element.setAttribute('height', future_height + 'px');
        element.setAttribute('width', future_width + 'px');
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
