import { Component, Input, Injectable  } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-empty-dumpster',
  templateUrl: './empty-dumpster.component.html',
  styleUrls: ['./empty-dumpster.component.scss']
})
export class EmptyDumpsterComponent {
  @Input() weight: undefined | number;

  constructor(private recyclingService: RecyclingService) {}

  emptydumpster() {
    this.recyclingService.emptyBin().subscribe(() => {
      this.weight = 0;
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class RecyclingService {

private binWeight: number = 30; // Peso iniziale del bidone

  emptyBin(): Observable<void> {
  this.binWeight = 0;
      return of();
  }

  getBinWeight(): number {
    return this.binWeight;
  }
}
