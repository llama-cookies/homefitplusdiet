import { Line } from 'vue-chartjs'
import firebase from '../../firebase.js'
import { mapGetters } from "vuex";

export default {
  extends: Line,
  data: function () {
    return {
        date: 'testing',
        chartdata: {
            datasets: [
              {
              label: 'Total Consumption',
              data: [],
              backgroundColor:"cyan",
              },
              /*{
                label: 'Sales2',
                data: [30,10,15],
                backgroundColor:'green'
              }*/
            ],
            labels: [],
        },
        options: {
          title: {
            display: true,
            text: 'Calorie Consumptions (Last 30 Entries)'
          }, 
          scales: {
            yAxes: [{ 
              scaleLabel: {
                display: true,
                labelString: "Total Calorie Consumption"
              }
            }],
            xAxes: [{ 
              scaleLabel: {
                display: true,
                labelString: "Valid Dates"
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: false
      },
    }
  },
  
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },

  methods: {
    fetchItems: function() {
        var docref = firebase.firestore().collection("calories").doc(this.user.data.id)
        //var today = this.date
        var chartdata = this.chartdata
        docref.get().then( function (doc) {
          if (doc.exists) {
            var ref2 = doc.data()
            var counter = 0
            var sortedKeys = []
            for (const item in ref2) {
              sortedKeys[sortedKeys.length] = item
            }
            sortedKeys.sort()
            for (const item in ref2) {
              if (counter == 30)
                break;
              let data = ref2[sortedKeys[counter]].consume
              // Total Calorie Consumption
              var total = parseInt(data.bfast) + parseInt(data.lunch) + parseInt(data.dinnr)
              chartdata.labels.push(sortedKeys[counter])
              chartdata.datasets[0].data.push(total)
              counter++
            }
          }
        })
    },
  },
  
  created () {
    this.fetchItems();
  },

  mounted () {
    this.renderChart(this.chartdata, this.options);
  }
}