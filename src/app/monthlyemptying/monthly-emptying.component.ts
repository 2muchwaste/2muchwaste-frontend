import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {UserInformationService} from "../services/userinformationservice"
import {Empty} from "../models/empty"
import {OperatorService} from "../services/backendcalls/operatorservice"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"
import {UserResponse} from "../models/userresponse"
import {EmptyService} from "../services/backendcalls/emptyservice"
import {CanvasJS} from "@canvasjs/angular-charts"
import {TrashTypeManager} from "../models/trashtype"
import {LocalStorageService} from "../services/localstorageservice"

interface DataChart {
  type: string,
  name: string,
  legendText: string,
  showInLegend: boolean,
  dataPoints: { label: string, y: number }[]
}

interface EmptyByTypeMonthly {
  garbageType: string,
  months: { monthName: string, quantity: number }[]
}

@Component({
  selector: 'app-monthly-emptying',
  templateUrl: './monthly-emptying.component.html',
  styleUrls: ['./monthly-emptying.component.scss']
})

export class MonthlyEmptyingComponent implements OnInit {

  public user!: UserResponse
  public userEmptied!: Empty[]
  public emptiedDataCharts!: DataChart[]
  public userEmptiedGroupedByTypeAndMonth!: EmptyByTypeMonthly[]
  public emptiedFromMonth = 1
  public exclLastNMonths = 0
  public chart: any
  private monthEmptied!: Empty[]
  buttonTextViewChart: string

  constructor(
    private userInfoService: UserInformationService,
    private operatorService: OperatorService,
    private authorizationService: Authorizationservice,
    private emptyService: EmptyService,
    private lStorageService: LocalStorageService
  ) {
    console.log('Monthlycost constuctor')
    console.log(this.userInfoService)
    this.buttonTextViewChart = "Cambia in grafico sulla quantità"
  }


  private getSlicedDeposits(deposits: Deposit[], fromMonth?: number, exlNLastMonths?: number) {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth()
    let firstDay = new Date(y, m, 1)
    let lastDay = new Date(y, m + 1, 1)

    firstDay.setMonth(firstDay.getMonth() - (fromMonth || 0))
    lastDay.setMonth(lastDay.getMonth() - (exlNLastMonths || 0))
    return emptied
      .filter(empty => empty.date >= firstDay)
      .filter(empty => empty.date < lastDay)
  }


  getEmptyCanvasOptions(dataChart: DataChart[]) {
    return {
      backgroundColor: "rgba(255,150,150,0)",
      animationEnabled: true,
      title: {
        text: "Svuotamenti"
      },
      axisX: {
        labelAngle: -90
      },
      axisY: {
        gridThickness: 1,
        gridColor: "rgba(200,200,200,0.6)",
        title: "data"
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: function (e: any) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false
          } else {
            e.dataSeries.visible = true
          }
          e.chart.render()
        }
      },
      data: dataChart
    }
  }

  private setUser() {
    // @ts-ignore
    this.operatorService.getOperatorByID(this.lStorageService.getUserID()).subscribe({
      next: (res) => this.user = this.userInfoService.user = res,
      error: err => console.log(err)
    })
  }

  getMonthTag(date: Date) {
    let dateFormat = date.toLocaleString('default', {month: 'long'})
      + (date.getFullYear() === new Date().getFullYear() ? '' : ' - ' + date.getFullYear())
    return dateFormat.charAt(0).toUpperCase() + dateFormat.slice(1)
  }


  getMonthlyEmptiedByType(emptied: Empty[], fromMonth: number, exlNLastMonths: number) {
    let emptiedLimited = this.getSlicedEmptied(emptied, fromMonth, exlNLastMonths)

    let types = emptiedLimited
      .map(empty => empty.type)
      .filter((emptyType, index, self) => index === self.indexOf(emptyType))

    let months: Date[] = []
    for (let i = 0; i <= fromMonth - exlNLastMonths; i++) {
      let x = new Date()
      x.setMonth(x.getMonth() - fromMonth + i)
      months.push(x)
    }

    let emptiedByTypeMonthly: EmptyByTypeMonthly[] = []
    for (let type of types) {
      let emptyOfType: EmptyByTypeMonthly = {
        garbageType: type,
        months: []
      }
      for (let month of months) {
        let quantityMonthResult: number = 0
        emptiedLimited
          .filter(empty => empty.type === type)
          .filter(empty => empty.date.getMonth() === month.getMonth())
          .forEach(dep => {
            quantityMonthResult = quantityMonthResult + dep.quantity
          })
        emptyOfType.months.push({
          monthName: this.getMonthTag(month),
          quantity: quantityMonthResult,
        })
      }
      emptiedByTypeMonthly.push(emptyOfType)
    }
    return emptiedByTypeMonthly
  }

  getDataChart(emptyTypelyMonthly: EmptyByTypeMonthly[]) {
    let trashTypeManager = new TrashTypeManager()
    let result: DataChart[] = []
    let firstType = true
    for (let type of emptyTypelyMonthly) {
      let emptyOfType: DataChart = {
        type: 'column',
        // @ts-ignore
        name: trashTypeManager.getItalianName(type.garbageType),
        // @ts-ignore
        legendText: trashTypeManager.getItalianName(type.garbageType),
        showInLegend: true,
        // @ts-ignore
        indexLabelFontSize: 12,
        indexLabelFontFamily: "Lucida Console",
        // @ts-ignore
        showInLegend: true,
        // @ts-ignore
        color: trashTypeManager.getColorForTrashType(type.garbageType),
        dataPoints: []
      }
      for (let month of type.months) {
        let monthName = firstType ? month.monthName + "<br>" : ""
        emptyOfType.dataPoints.push({
          label: month.monthName,
S         // @ts-ignore
          toolTipContent: monthName + "{name}: <strong>" + month.quantity + "</strong>Kg <strong>",
          indexLabel: (month.quantity > 0 && this.monthlyCostContainer.nativeElement.offsetWidth > 800
            // @ts-ignore
            ? trashTypeManager.getItalianName(type.garbageType).substring(0, 5) : "")
        })
      }
      firstType = false
      result.push(emptyOfType)
    }
    return result

  }

  emptyDataChart(fromMonth: number, exlNLastMonths: number) {
    let dataC: DataChart[] = []
    let dep: DataChart = {
      type: 'column',
      name: '',
      legendText: '',
      // @ts-ignore
      indexLabelFontSize: 12,
      indexLabelFontFamily: "Lucida Console",
      dataPoints: []
    }
    dataC.push(dep)
    for (let i = fromMonth; i - exlNLastMonths >= 0; i--) {
      let month = new Date()
      month.setMonth(month.getMonth() - i)
      console.log("month", month)
      dep.dataPoints.push({
        label: this.getMonthTag(month),
        y: 0
      })
    }
    return dataC
  }


  updateDataChart() {
    this.userEmptiedGroupedByTypeAndMonth = this.getMonthlyEmptiedByType(this.userEmptied, this.emptiedFromMonth, this.exclLastNMonths)
    console.log("this.userEmptiedGroupedByTypeAndMonth", this.userEmptiedGroupedByTypeAndMonth)
    this.emptiedDataCharts = this.userEmptiedGroupedByTypeAndMonth.length > 0 ?
      this.getDataChart(this.userEmptiedGroupedByTypeAndMonth)
      : this.emptyDataChart(this.depositsFromMonth, this.exclLastNMonths)
    console.log("this.emptyDataChart", this.emptyDataCharts)
    this.chart.options.data = this.emptyDataCharts
    this.chart.render()
  }

  previousMonth() {
    console.log('previousMonth')
    this.depositsFromMonth += 1
    this.exclLastNMonths += 1
    this.updateDataChart()
  }

  nextMonth() {
    console.log('nextMonth')
    this.depositsFromMonth -= 1
    this.exclLastNMonths -= 1
    this.updateDataChart()
  }

  private setEmptied() {

    // @ts-ignore
    this.emptyService.getEMptiedFromUser(this.lStorageService.getUserID()).subscribe({
      next: res => {
        let emptied = res.map(empty => {
          empty.date = new Date(empty.date)
          return empty
        })
        this.userEmptied = this.userInfoService.userEmptied = emptied
        this.monthEmptied = this.userEmptied.filter(empty => empty.date.getMonth() > (new Date()).getMonth() - 1)
        this.chart = new CanvasJS.Chart('chartContainer', this.getEmptyCanvasOptions([]))
        this.updateDataChart()
        // this.chart.render()
      },
      error: err => console.log(err)
    })
  }
}
