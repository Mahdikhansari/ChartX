var json_data =
{
    "title":                "Network Level VoNR Accessibility",
    "subTitle":             "HOU, CLE, JUS",
    "legend":               false,
    "x":
    {
        "data_type":        "dateTime",
        "label":            "Time",
        "unit":             "s",
        "values":           
            // [0,1,2,3,4,5,6,7,8,9,
            // 10,11,12,13,14,15,16,
            // 17,18,19]  
            [0,1,2,3,4,5,6,7,8,9,
            10,11,12,13,14,15,16,
            17,18,19]  
    },

    "y" : 
    [
        {
            "id":           "y_0",
            "label":        "KPI_1",
            "unit":         "%",      
            "chart_type":   "line",
            "color":        "red",
            "dots":         true,
            "dots-radius":  "3",
            "stroke-width": "2",
            "secondary_axis":false,
            "values":       
                [10,3,4,2,1,8,3,3,9,
                10,3,4,2,1,8,3,3,9,2,3]
        },
        {
            "id":           "y_1",
            "label":        "Mahdi",
            "unit":         "Mbps",      
            "chart_type":   "line",
            "color":        "gray",
            "dots":         false,
            "stroke-width": "3",
            "secondary_axis":false,
            "values":       
                [2,4,5,3,2,1,2,44,20,
                2,4,5,3,2,1,2,44,20,19,15]
        },
        {
            "id":           "y_1",
            "label":        "Arash",
            "unit":         "%",      
            "chart_type":   "line",
            "color":        "blue",
            "dots":         false,
            "stroke-width": "1",
            "secondary_axis":false,
            "values":       
                [0,2,3,1,0,7,2,2,8,
                0,2,3,1,0,7,2,2,8,4,2]
        },
        {
            "id":           "y_1",
            "label":        "New_KPI",
            "unit":         "Kg",      
            "chart_type":   "line",
            "color":        "Green",
            "dots":         false,
            "stroke-width": "2",
            "secondary_axis":true,
            "values":       
                [10,12,13,21,10,27,32,22,18,
                20,2,33,21,10,7,21,2,18,24,12]
        }
    ]
}
;