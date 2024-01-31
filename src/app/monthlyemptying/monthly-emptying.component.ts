import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core'
import {UserInformationService} from "../services/userinformationservice"
import {OperatorInformationService} from "../services/operatorinformationservice"
import {Empty} from "../models/empty"
import {OperatorService} from "../services/backendcalls/operatorservice"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"
import {UserResponse} from "../models/userresponse"
import {CanvasJS} from "@canvasjs/angular-charts"
import {TrashTypeManager, TrashTypes} from "../models/trashtype"
import {LocalStorageService} from "../services/localstorageservice"
import {DumpsterService} from "../services/backendcalls/dumpsterservice";

interface DataChart {
  type: string,
  name: string,
  legendText: string,
  showInLegend: boolean,
  dataPoints: { label: string, y: number }[]
}

interface EmptyByTypeMonthly {
  garbageType: string,
  garbageTypeItalianName: string,
  months: { monthName: string, quantity: number }[]
}

interface EmptyByMonthType {
  month: string,
  garbageType: { typeName: string, quantity: number }[]
}

@Component({
  selector: 'app-monthly-emptying',
  templateUrl: './monthly-emptying.component.html',
  styleUrls: ['./monthly-emptying.component.scss']
})

export class MonthlyEmptyingComponent implements OnInit {

  public user!: UserResponse
  public userEmpties!: Empty[]
  public emptyDataCharts!: DataChart[]
  public userEmptyGroupedByTypeAndMonth!: EmptyByTypeMonthly[]
  public userEmptyGroupedByMonthAndType: EmptyByMonthType[]
  public emptyFromMonth = 1
  public exclLastNMonths = 0
  showWrittenInformation: boolean = false;

  public chart: any
  public trashTypeManager = new TrashTypeManager()
  private monthEmpty!: Empty[]
  buttonTextViewChart: string
  private CLASS_TAG = "MonthlyEmptyingComponent"

  constructor(
    private userInfoService: UserInformationService,
    private dumpsterService: DumpsterService,
    private operatorInfoService: OperatorInformationService,
    private operatorService: OperatorService,
    private authorizationService: Authorizationservice,
    private lStorageService: LocalStorageService
  ) {
    console.log('Monthlycost constuctor')
    console.log(this.userInfoService)
    this.userEmptyGroupedByMonthAndType = []
    this.buttonTextViewChart = "Cambia in grafico sulla quantità"
  }

  @ViewChild('monthlyEmptyingContainer') monthlyEmptyingContainer!: ElementRef

  ngOnInit(): void {
    console.log('MonthlyCost OnInit')
    this.authorizationService.checkAuthDataORRedirect()
    this.setUser()
    this.setEmpty()
  }

  private getSlicedEmpty(empties: Empty[], fromMonth?: number, exlNLastMonths?: number) {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth()
    let firstDay = new Date(y, m, 1)
    let lastDay = new Date(y, m + 1, 1)

    firstDay.setMonth(firstDay.getMonth() - (fromMonth || 0))
    lastDay.setMonth(lastDay.getMonth() - (exlNLastMonths || 0))
    return empties
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

  getMonthlyEmptyByType(empties: Empty[], fromMonth: number, exlNLastMonths: number) {
    let emptyLimited = this.getSlicedEmpty(empties, fromMonth, exlNLastMonths)

    let types = emptyLimited
      .map(empty => empty.dumpster.type)
      .filter((emptyType, index, self) => index === self.indexOf(emptyType))

    let months: Date[] = []
    for (let i = 0; i <= fromMonth - exlNLastMonths; i++) {
      let x = new Date()
      x.setMonth(x.getMonth() - fromMonth + i)
      months.push(x)
    }

    let emptyByTypeMonthly: EmptyByTypeMonthly[] = []
    for (let type of types) {
      let emptyOfType: EmptyByTypeMonthly = {
        garbageType: type,
        // @ts-ignore
        garbageTypeItalianName: this.trashTypeManager.getItalianName(type),
        months: []
      }
      // AAA: la quantità degli scarichi non è salvata da nessuna parte quindi non può essere usata
      // per calcoli vari
      for (let month of months) {
        let quantityMonthResult: number = 0
        emptyLimited
          .filter(empty => empty.dumpster.type === type)
          .filter(empty => empty.date.getMonth() === month.getMonth())
          .forEach(dep => {
            quantityMonthResult = quantityMonthResult + dep.quantity
          })
        emptyOfType.months.push({
          monthName: this.getMonthTag(month),
          quantity: quantityMonthResult,
        })
      }
      emptyByTypeMonthly.push(emptyOfType)
    }
    console.log("emptyByTypeMonthly", emptyByTypeMonthly)
    return emptyByTypeMonthly
  }

  getDataChart(emptyTypelyMonthly: EmptyByTypeMonthly[]) {

    let result: DataChart[] = []
    let firstType = true
    for (let type of emptyTypelyMonthly) {
      let emptyOfType: DataChart = {
        type: 'column',
        // @ts-ignore
        name: this.trashTypeManager.getItalianName(type.garbageType),
        // @ts-ignore
        legendText: this.trashTypeManager.getItalianName(type.garbageType),
        showInLegend: true,
        // @ts-ignore
        indexLabelFontSize: 12,
        indexLabelFontFamily: "Lucida Console",
        // @ts-ignore
        showInLegend: true,
        // @ts-ignore
        color: this.trashTypeManager.getColorForTrashType(type.garbageType),
        dataPoints: []
      }
      for (let month of type.months) {
        let monthName = firstType ? month.monthName + "<br>" : ""
        emptyOfType.dataPoints.push({
          label: month.monthName,
          // @ts-ignore
          toolTipContent: monthName
            + (month.quantity <= 0 ? "<div class='not-in-tool-tip'>" : "<div>")
            + "{name}: <strong>" + month.quantity.toFixed(2) + "</strong>Kg <strong>"
            + "</div>"
          ,
          indexLabel: (month.quantity > 0 && this.monthlyEmptyingContainer.nativeElement.offsetWidth > 800
            // @ts-ignore
            ? this.trashTypeManager.getItalianName(type.garbageType).substring(0, 5) : "")
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
    this.userEmptyGroupedByTypeAndMonth = this.getMonthlyEmptyByType(this.userEmpties, this.emptyFromMonth, this.exclLastNMonths)
    this.groupByMonthAndType()
    console.log("this.userEmptyGroupedByTypeAndMonth", this.userEmptyGroupedByTypeAndMonth)
    this.emptyDataCharts = this.userEmptyGroupedByTypeAndMonth.length > 0 ?
      this.getDataChart(this.userEmptyGroupedByTypeAndMonth)
      : this.emptyDataChart(this.emptyFromMonth, this.exclLastNMonths)
    console.log("this.emptyDataChart", this.emptyDataCharts)
    this.chart.options.data = this.emptyDataCharts
    this.chart.render()
  }

  previousMonth() {
    console.log('previousMonth')
    this.emptyFromMonth += 1
    this.exclLastNMonths += 1
    this.updateDataChart()
  }

  nextMonth() {
    console.log('nextMonth')
    this.emptyFromMonth -= 1
    this.exclLastNMonths -= 1
    this.updateDataChart()
  }

  private setEmpty() {

    // @ts-ignore
    this.operatorService.getOperatorEmptiesByCFRaw(this.lStorageService.getUserCF()).subscribe({
      next: (res) => {
        let empties = res.empties.map(empty => {
          empty.date = new Date(empty.date)
          return empty
        })

         this.setEmpties(empties)
        // this.chart.render()
      },
      error: (err) => console.log(err)
    })
  }

  setEmpties(empties:any) {
    // @ts-ignore
    this.operatorService.getOperatorEmptiesByCFRaw(this.lStorageService.getUserCF()).subscribe({
      next: (res) => {
        console.log(this.CLASS_TAG + ": res", res)
        this.userInfoService.userEmpties = this.userEmpties = []
        res.empties.forEach(empty => {
          this.dumpsterService.getDumpsterByID(empty.dumpsterID).subscribe({
            next: (res) => {
              this.userInfoService.userEmpties.push({
                // @ts-ignore
                userID: this.lStorageService.getUserID(),
                dumpster: res,
                type: empty.type,
                date: empty.date,
                quantity: 0
              })
              this.userEmpties = this.userInfoService.userEmpties = empties
              console.log(this.CLASS_TAG + ": this.userInfoService", this.userInfoService)
              this.monthEmpty = this.userEmpties.filter(empty =>new Date(empty.date).getMonth() > (new Date()).getMonth() - 1)
              this.chart = new CanvasJS.Chart('chartContainer', this.getEmptyCanvasOptions([]))
              this.updateDataChart()
              console.log("this.userEmptyGroupedByTypeAndMonth", this.userEmptyGroupedByTypeAndMonth)
            },
            error: (err) => {
            }
          })
        })
      },
      error: (err) => {
      }
    })
  }

  groupByMonthAndType() {
    let months: any[] = []
    this.userEmptyGroupedByMonthAndType = []
    console.log("this.userEmptyGroupedByTypeAndMonth[0].months[0]", this.userEmptyGroupedByTypeAndMonth[0].months[0])
    this.userEmptyGroupedByTypeAndMonth[0].months.forEach(month => months.push(month.monthName))
    console.log("months", months)
    months.forEach(month => {
      let x = ""
      let types: any[] = []
      this.userEmptyGroupedByTypeAndMonth.forEach(type => {
        let z: any
        type.months
          .filter(m => m.monthName === month)
          .forEach(month2 => {
            // @ts-ignore
            //   this.userEmptyGroupedByMonthAndType.push(month.monthName + " " +type.garbageTypeItalianName + " " + month2.quantity)
            types.push({typeName: type.garbageTypeItalianName, quantity: Math.ceil(month2.quantity * 100) / 100})
            // x = " " +type.garbageTypeItalianName + " " + month2.quantity
          })
      })
      this.userEmptyGroupedByMonthAndType.push({
        month: month,
        garbageType: types
      })
    })
    console.log("this.userEmptyGroupedByMonthAndType", this.userEmptyGroupedByMonthAndType)
  }

  viewWrittenInformation() {
    this.showWrittenInformation = !this.showWrittenInformation
  }
}
