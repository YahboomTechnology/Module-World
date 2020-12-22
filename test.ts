// tests go here; this will not be compiled when this package is used as a library
/*ModuleWorld_Display.RGBinit()
ModuleWorld_Control.IRinit(Pins.D3)
ModuleWorld_Control.IRonPressEvent(RemoteButton.Power, function () {
	ModuleWorld_Display.RGB2(2,ModuleWorld_Display.enColor.Cyan);
})
ModuleWorld_Control.IRonPressEvent(RemoteButton.Up, function () {
	ModuleWorld_Display.RGB2(2,ModuleWorld_Display.enColor.Yellow);
})*/
ModuleWorld_Sensor.Vibration(ModuleWorld_Sensor.mwDigitalNum.DigitalNum1, function() {
	basic.showNumber(1)
})
basic.forever(function () {
	/*if (ModuleWorld_Sensor.Vibration(1,1)) {
    	basic.showNumber(1)
    } else if (ModuleWorld_Sensor.Vibration(1,1)) {
    	basic.showNumber(2)
    } else if (ModuleWorld_Control.Rocker(1,3)) {
    	basic.showNumber(3)
    } else if (ModuleWorld_Control.Rocker(1,4)) {
    	basic.showNumber(4)
    }*/
	//basic.showNumber(1)
    //TM1650.showNumber(ModuleWorld_Sensor.GetRGBValue(ModuleWorld_Sensor.enGetRGB.GetValueR))
	basic.showNumber(0)
	//basic.showNumber(0)
	//basic.showNumber(ModuleWorld_Sensor.Light(2))
	//basic.pause(10)
    //ModuleWorld_Control.MotorRun(1,1,20);
    //ModuleWorld_Display.RGB2(2,ModuleWorld_Display.enColor.Cyan);
    //ModuleWorld_Control.Servo(1,360);
    /*if (ModuleWorld_Sensor.IR(1,1)) {
    	basic.showNumber(1)
    } else {
    	basic.showNumber(0)
    }*/
})
