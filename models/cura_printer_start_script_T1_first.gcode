	; start script
G21							; metric values
G90							; absolute positioning
M83							; extruder relative mode
M115 U3.0.10				; tell printer latest fw version
M107						; start with the fan off

G28							; home all

G1 Z0.6 F{travel_speed}

T1							; prime T1
G1 X10 Y5
G1 F3000 E140				; undo storage position
G1 F{travel_speed}

; Put printing message on LCD screen
M117 Priming complete

M82							; set extruder to absolute mode
G92 E0						; zero the extruded length
