import { Component, OnInit } from '@angular/core';
  import carta from '../assets/icons/bidone_carta.jpg'
  import vetro from '../assets/icons/bidone_vetro.jpg'
  import plastica from '../assets/icons/bidone_plastica.jpg'
  import indifferenziata from '../assets/icons/bidone_indifferenziata.jpg'
  import organico from '../assets/icons/bidone_organico.jpg'
// import axios from 'axios';
// import { StateOfBins } from '../types/StateOfBins';
// import { sendEmail } from '@/utils/api';
// import { LoadingScreen } from '@/components/LoadingScreen.component';

@Component({
  selector: 'app-statebin',
  templateUrl: './statebin.component.html',
  styleUrls: ['./statebin.component.scss']
})
export class StatebinComponent implements OnInit {

  bins: StateOfBins[] = [];
  municipality: string = '';
  isDataLoaded: boolean = false;

  ngOnInit(): void {
    this.getBinState();
  }

//computes the correct image for each bin
  function getImg(src:string){
    switch ( src ) {
      case "carta":
          return carta
      case "vetro":
          return vetro
      case "plastica e lattine":
          return plastica
      case "indifferenziata":
          return indifferenziata
      case "organico":
          return organico
      case "olio":
          return olio
      case "sfralci e potature":
          return potature
    }
}

  const props = defineProps(["n"])
  //compute the percentage for the bin
  const percentage = (props.n.actual_kg * 100 / props.n.max_kg).toFixed(2)

  async getBinState(): Promise<void> {
    try {
      sendEmail()
        .then((responseData) => {
          this.bins = responseData.map((item: any): StateOfBins => {
            return {
              id: item._id,
              actual_kg: item.actual_kg,
              max_kg: item.typology[0].max_kg,
              address: item.address,
              typology: item.typology[0].name,
              municipality: item.municipality[0].name,
            };
          });

          if (this.bins.length > 0) {
            this.municipality = this.bins[0].municipality;
          }
          this.isDataLoaded = true;
        })
        .catch((error) => {
          console.log('Error:', error);
          // Handle the error if needed
        });
    } catch (e) {
      console.error(e);
      this.isDataLoaded = false;
    }
  }
}
