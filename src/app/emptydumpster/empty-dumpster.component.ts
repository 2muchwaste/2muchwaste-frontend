import { Component, Input, Injectable  } from '@angular/core';

export class EmptyDumpsterComponent {
  @Input() weight: number;

  constructor(private recyclingService: RecyclingService) {}

  emptydumpster() {
    this.recyclingService.emptyBin().subscribe(() => {
      this.weight = 0;
    });
  }
}

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
