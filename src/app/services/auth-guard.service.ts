import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const PfPj = false; // ... your login logic here
        if (PfPj) {
            return true;
        } else {
            this.router.navigate(['/app-meus-dados']);
            return false;
        }
    }
}
