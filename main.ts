/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from chengengyue
*/


//% color="#228B22" weight=25 icon="\uf0b2"
namespace ModuleWorld_Digital {
	
    export enum mwDigitalNum {
        //% blockId="P0P1" block="P0P1"
        P0P1 = 1,
        //% blockId="P2P3" block="P2P3"
        P2P3 = 2,
        //% blockId="P3P4" block="P3P4"
        P3P4 = 3,
        //% blockId="P4P5" block="P4P5"
        P4P5 = 4,
        //% blockId="P6P7" block="P6P7"
        P6P7 = 5,
        //% blockId="P8P9" block="P8P9"
        P8P9 = 6,
        //% blockId="P10P11" block="P10P11"
        P10P11 = 7,
        //% blockId="P12P13" block="P12P13"
        P12P13 = 8,
        //% blockId="P14P15" block="P14P15"
        P14P15 = 9,
        //% blockId="P1P10" block="P1P10"
        P1P10 = 10
    }	
	

    export enum enObstacle {
        //% blockId="Obstacle" block="Obstacle"
        Obstacle = 0,
        //% blockId="NoObstacle" block="NoObstacle"
        NoObstacle = 1
    }

    export enum enPIR {
        //% blockId="NoPIR" block="NoPIR"
        NoPIR = 0,
        //% blockId="OPIR" block="OPIR"
        OPIR = 1
    }

    export enum enCollision {
        //% blockId="NoCollision" block="NoCollision"
        NoCollision = 0,
        //% blockId="OCollision" block="OCollision"
        OCollision = 1
    }

    export enum enVibration {
        //% blockId="NoVibration" block="NoVibration"
        NoVibration = 0,
        //% blockId="OVibration" block="OVibration"
        OVibration = 1
    }
	
    export enum DHT11Type {
        //% block="temperature(℃)" enumval=0
        DHT11_temperature_C,

        //% block="temperature(℉)" enumval=1
        DHT11_temperature_F,

        //% block="humidity(0~100)" enumval=2
        DHT11_humidity,
    }
    export enum enButton {
        //% blockId="Press" block="Press"
        Press = 0,
        //% blockId="Realse" block="Realse"
        Realse = 1
    }	

	//% blockId="readdht11" block="value of dht11 %dht11type| at pin %value_DNum"
    //% weight=100
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5 
    export function dht11value(dht11type: DHT11Type, value_DNum: mwDigitalNum): number {
		let dht11pin;
		if(value_DNum == 1)	{ dht11pin = DigitalPin.P0; }
		else if(value_DNum == 2)	{ dht11pin = DigitalPin.P2; }
		else if(value_DNum == 3)	{ dht11pin = DigitalPin.P3; }
		else if(value_DNum == 4)	{ dht11pin = DigitalPin.P4; }
		else if(value_DNum == 5)	{ dht11pin = DigitalPin.P6; }
		else if(value_DNum == 6)	{ dht11pin = DigitalPin.P8; }
		else if(value_DNum == 7)	{ dht11pin = DigitalPin.P10; }
		else if(value_DNum == 8)	{ dht11pin = DigitalPin.P12; }
		else if(value_DNum == 9)	{ dht11pin = DigitalPin.P14; }
		else if(value_DNum == 10)	{ dht11pin = DigitalPin.P1; }
			
		pins.digitalWritePin(dht11pin, 0)
		basic.pause(18)
		let i = pins.digitalReadPin(dht11pin)
		pins.setPull(dht11pin, PinPullMode.PullUp);
		switch (dht11type) {
			case 0:
				let dhtvalue1 = 0;
				let dhtcounter1 = 0;
				let dhtcounter1d = 0;
				while (pins.digitalReadPin(dht11pin) == 1);
				while (pins.digitalReadPin(dht11pin) == 0);
				while (pins.digitalReadPin(dht11pin) == 1);
				for (let i = 0; i <= 32 - 1; i++) {
					dhtcounter1d = 0
					while (pins.digitalReadPin(dht11pin) == 0) {
						dhtcounter1d += 1;
					}
					dhtcounter1 = 0
					while (pins.digitalReadPin(dht11pin) == 1) {
						dhtcounter1 += 1;
					}
					if (i > 15) {
						if (dhtcounter1 > dhtcounter1d) {
							dhtvalue1 = dhtvalue1 + (1 << (31 - i));
						}
					}
				}
				return ((dhtvalue1 & 0x0000ff00) >> 8);
				break;
			case 1:
				while (pins.digitalReadPin(dht11pin) == 1);
				while (pins.digitalReadPin(dht11pin) == 0);
				while (pins.digitalReadPin(dht11pin) == 1);
				let dhtvalue = 0;
				let dhtcounter = 0;
				let dhtcounterd = 0;
				for (let i = 0; i <= 32 - 1; i++) {
					dhtcounterd = 0
					while (pins.digitalReadPin(dht11pin) == 0) {
						dhtcounterd += 1;
					}
					dhtcounter = 0
					while (pins.digitalReadPin(dht11pin) == 1) {
						dhtcounter += 1;
					}
					if (i > 15) {
						if (dhtcounter > dhtcounterd) {
							dhtvalue = dhtvalue + (1 << (31 - i));
						}
					}
				}
				return Math.round((((dhtvalue & 0x0000ff00) >> 8) * 9 / 5) + 32);
				break;
			case 2:
				while (pins.digitalReadPin(dht11pin) == 1);
				while (pins.digitalReadPin(dht11pin) == 0);
				while (pins.digitalReadPin(dht11pin) == 1);

				let value = 0;
				let counter = 0;
				let counterd = 0;

				for (let i = 0; i <= 8 - 1; i++) {
					counterd = 0
					while (pins.digitalReadPin(dht11pin) == 0) {
						counterd += 1;
					}
					counter = 0
					while (pins.digitalReadPin(dht11pin) == 1) {
						counter += 1;
					}
					if (counter > counterd) {
						value = value + (1 << (7 - i));
					}
				}
				return value;
			default:
				return 0;
		}
    }


    //% blockId=ModuleWorld_Digital_Ultrasonic block="Ultrasonic|pin %value_DNum"
    //% weight=97
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Ultrasonic(value_DNum: mwDigitalNum): number {
        //send pulse
		let Trig,Echo;		
		if(value_DNum == 1)	{ Trig = DigitalPin.P0; Echo = DigitalPin.P1; }
		else if(value_DNum == 2)	{ Trig = DigitalPin.P2; Echo = DigitalPin.P3; }
		else if(value_DNum == 3)	{ Trig = DigitalPin.P3; Echo = DigitalPin.P4; }
		else if(value_DNum == 4)	{ Trig = DigitalPin.P4; Echo = DigitalPin.P5; }
		else if(value_DNum == 5)	{ Trig = DigitalPin.P6; Echo = DigitalPin.P7; }
		else if(value_DNum == 6)	{ Trig = DigitalPin.P8; Echo = DigitalPin.P9; }
		else if(value_DNum == 7)	{ Trig = DigitalPin.P10; Echo = DigitalPin.P11; }
		else if(value_DNum == 8)	{ Trig = DigitalPin.P12; Echo = DigitalPin.P13; }
		else if(value_DNum == 9)	{ Trig = DigitalPin.P14; Echo = DigitalPin.P15; }
		else if(value_DNum == 10)	{ Trig = DigitalPin.P1; Echo = DigitalPin.P10; }
		
		
        pins.setPull(Trig, PinPullMode.PullNone);
        pins.digitalWritePin(Trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(Trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(Trig, 0);

        //read pulse, maximum distance=500cm
        const d = pins.pulseIn(Echo, PulseValue.High, 500 * 58);   

        return Math.idiv(d, 58);
    }

    //% blockId=ModuleWorld_Digital_IR block="IR|pin %value_DNum|value %value"
    //% weight=96
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function IR(value_DNum: mwDigitalNum, value: enObstacle): boolean {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P3; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P6; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 7)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 8)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 9)	{ pin = DigitalPin.P14; }
		else if(value_DNum == 10)	{ pin = DigitalPin.P1; }

        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }

    //% blockId=ModuleWorld_Digital_PIR block="PIR|pin %value_DNum|value %value"
    //% weight=96
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function PIR(value_DNum: mwDigitalNum, value: enPIR): boolean {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P3; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P6; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 7)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 8)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 9)	{ pin = DigitalPin.P14; }
		else if(value_DNum == 10)	{ pin = DigitalPin.P1; }

        pins.setPull(pin, PinPullMode.PullDown);
	pins.digitalWritePin(pin, 1);
        return pins.digitalReadPin(pin) == value;
    }
	
    //% blockId=ModuleWorld_Digital_Collision block="Collision|pin %value_DNum|value %value"
    //% weight=3
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Collision(value_DNum: mwDigitalNum, value: enCollision): boolean {
		
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P3; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P6; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 7)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 8)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 9)	{ pin = DigitalPin.P14; }
		else if(value_DNum == 10)	{ pin = DigitalPin.P1; }
		
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }

    //% blockId=ModuleWorld_Digital_Button block="Button|pin %value_DNum|value %value"
    //% weight=3
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Button(value_DNum: mwDigitalNum, value: enButton): boolean {
		
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P3; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P6; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 7)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 8)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 9)	{ pin = DigitalPin.P14; }
		else if(value_DNum == 10)	{ pin = DigitalPin.P1; }
		
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }
    //% blockId=ModuleWorld_Digital_Vibration block="Vibration|pin %value_DNum|get "
    //% weight=1
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Vibration(value_DNum: mwDigitalNum, handle: () => void): void {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P3; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P6; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 7)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 8)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 9)	{ pin = DigitalPin.P14; }
		else if(value_DNum == 10)	{ pin = DigitalPin.P1; }
		
        pins.setPull(pin, PinPullMode.PullUp);
		pins.setEvents(pin, PinEventType.Edge);
		control.onEvent(pin, DAL.MICROBIT_PIN_EVT_FALL, handle);
    }


}

//% color="#C814B8" weight=24 icon="\uf1d4"
namespace ModuleWorld_Analog {

    export enum enRocker {
        //% blockId="NoState" block="NoState"
        NoState = 0,
        //% blockId="Up" block="Up"
        Up,
        //% blockId="Down" block="Down"
        Down,
        //% blockId="Left" block="Left"
        Left,
        //% blockId="Right" block="Right"
        Right
    }

    export enum mwAnalogNum {
        //% blockId="P0P1" block="P0P1"
        AP0P1 = 1,
        //% blockId="P2P3" block="P2P3"
        AP2P3 = 2,
        //% blockId="P3P4" block="P3P4"
        AP3P4 = 3
    }	

    //% blockId=ModuleWorld_Anaglog_Light block="Light|pin %value_ANum"
    //% weight=100
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5 
    export function Light(value_ANum: mwAnalogNum): number {
		let lightpin;
		let value: number;
		if(value_ANum == 1)	{ lightpin = AnalogPin.P0; }
		else if(value_ANum == 2)	{ lightpin = AnalogPin.P2; }
		else if(value_ANum == 3)	{ lightpin = AnalogPin.P3; }
		
        value = 1024-pins.analogReadPin(lightpin);
        return value;
        //return 0;
    }
	
    //% blockId=ModuleWorld_Anaglog_Sound block="Sound|pin %value_ANum"
    //% weight=99
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Sound(value_ANum: mwAnalogNum): number {
		let soundpin;
		let value: number;
		if(value_ANum == 1)	{ soundpin = AnalogPin.P0; }
		else if(value_ANum == 2)	{ soundpin = AnalogPin.P2; }
		else if(value_ANum == 3)	{ soundpin = AnalogPin.P3; }
		
        value = pins.analogReadPin(soundpin);
        return value;
        //return 0;
    }
	//% blockId=ModuleWorld_Anaglog_Potentiometer block="Potentiometer|pin %value_ANum"
    //% weight=2
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOption.columns=5
    export function Potentiometer(value_ANum: mwAnalogNum): number {
		let pin;
		let value: number;
		if(value_ANum == 1)	{ pin = AnalogPin.P0; }
		else if(value_ANum == 2)	{ pin = AnalogPin.P2; }
		else if(value_ANum == 3)	{ pin = AnalogPin.P3; }
		
        value = pins.analogReadPin(pin);
        return value;
    }
	
    //% blockId=ModuleWorld_Anaglog_Rocker block="Rocker|pin %value_ANum|value %value"
    //% weight=1
    //% blockGap=20
    export function Rocker(value_ANum: mwAnalogNum, value: enRocker): boolean {
		
		let pin1;
		let pin2;

		if(value_ANum == 1)	{ pin1 = AnalogPin.P0; pin2 = AnalogPin.P1; }
		else if(value_ANum == 2)	{ pin1 = AnalogPin.P2; pin2 = AnalogPin.P3; }
		else if(value_ANum == 3)	{ pin1 = AnalogPin.P3; pin2 = AnalogPin.P4; }
		
        let x = pins.analogReadPin(pin1);
        let y = pins.analogReadPin(pin2);
		
        let now_state = enRocker.NoState;

        if (x < 100) // 左
        {
            now_state = enRocker.Left;
        }
        else if (x > 700) //右
        {
            now_state = enRocker.Right;
        }
        else  // 上下
        {
            if (y < 100) //下
            {
                now_state = enRocker.Down;
            }
            else if (y > 700) //上
            {
                now_state = enRocker.Up;
            }
        }
        return now_state == value;
    }
	

	

}

//% color="#ECA40D" weight=22 icon="\uf085"
namespace ModuleWorld_PWM {

    export enum enColor {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="Red" block="Red"
        Red,
        //% blockId="Green" block="Green"
        Green,
        //% blockId="Blue" block="Blue"
        Blue,
        //% blockId="White" block="White"
        White,
        //% blockId="Cyan" block="Cyan"
        Cyan,
        //% blockId="Pinkish" block="Pinkish"
        Pinkish,
        //% blockId="Yellow" block="Yellow"
        Yellow
    }

    export enum mwDigitalNum {
        //% blockId="P0P1" block="P0P1"
        P0P1 = 1,
        //% blockId="P2P3" block="P2P3"
        P2P3 = 2,
        //% blockId="P3P4" block="P3P4"
        P3P4 = 3,
        //% blockId="P4P5" block="P4P5"
        P4P5 = 4,
        //% blockId="P6P7" block="P6P7"
        P6P7 = 5,
        //% blockId="P8P9" block="P8P9"
        P8P9 = 6,
        //% blockId="P10P11" block="P10P11"
        P10P11 = 7,
        //% blockId="P12P13" block="P12P13"
        P12P13 = 8,
        //% blockId="P14P15" block="P14P15"
        P14P15 = 9,
        //% blockId="P1P10" block="P1P10"
        P1P10 = 10
    }	
	
    export enum mwServoNum {
        //% blockId="P1" block="P1"
        P1 = 1,
        //% blockId="P4" block="P4"
        P4 = 2,
        //% blockId="P2" block="P2"
        P2 = 3,
        //% blockId="P10" block="P10"
        P10 = 4
    }	
	
	

    //% blockId=ModuleWorld_PWM_BuzzerPin block="Set Buzzer Pin|%value_DNum"
    //% weight=99
    //% blockGap=22
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function BuzzerPin(value_DNum: mwDigitalNum): void {
		let pinb;
		if(value_DNum == 1)	{ pinb = AnalogPin.P0 }
		else if(value_DNum == 2)	{ pinb = AnalogPin.P2 }
		else if(value_DNum == 3)	{ pinb = AnalogPin.P3 }
		else if(value_DNum == 4)	{ pinb = AnalogPin.P4 }
		else if(value_DNum == 5)	{ pinb = AnalogPin.P6 }
		else if(value_DNum == 6)	{ pinb = AnalogPin.P8 }
		else if(value_DNum == 7)	{ pinb = AnalogPin.P10 }
		else if(value_DNum == 8)	{ pinb = AnalogPin.P12 }
		else if(value_DNum == 9)	{ pinb = AnalogPin.P14 }
		else if(value_DNum == 10)	{ pinb = AnalogPin.P1 }
		
		pins.setAudioPin(pinb);
    }
    //% blockId=ModuleWorld_PWM_VibrationMot block="Vibration Motor|%value_DNum|speed %speed"
    //% weight=80
    //% blockGap=22
    //% speed.min=0 speed.max=1023
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function VibrationMot(value_DNum: mwDigitalNum, speed: number): void {
		
		let pin;
		if(value_DNum == 1)	{ pin = AnalogPin.P0; }
		else if(value_DNum == 2)	{ pin = AnalogPin.P2; }
		else if(value_DNum == 3)	{ pin = AnalogPin.P3; }
		else if(value_DNum == 4)	{ pin = AnalogPin.P4; }
		else if(value_DNum == 5)	{ pin = AnalogPin.P6; }
		else if(value_DNum == 6)	{ pin = AnalogPin.P8; }
		else if(value_DNum == 7)	{ pin = AnalogPin.P10; }
		else if(value_DNum == 8)	{ pin = AnalogPin.P12; }
		else if(value_DNum == 9)	{ pin = AnalogPin.P14; }
		else if(value_DNum == 10)	{ pin = AnalogPin.P1; }
		
        pins.analogWritePin(pin, speed);
    }
	
    //% blockId=ModuleWorld_PWM_RGB block="RGB|(P12P13P14)|value1 %value1|value2 %value2|value3 %value3"
    //% weight=2
    //% blockGap=20
    //% value1.min=0 value1.max=255 value2.min=0 value2.max=255 value3.min=0 value3.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB(value1: number, value2: number, value3: number): void {
		
        pins.analogWritePin(AnalogPin.P13, value1 * 1024 / 256);
        pins.analogWritePin(AnalogPin.P14, value2 * 1024 / 256);
        pins.analogWritePin(AnalogPin.P12, value3 * 1024 / 256);
    }
	
    //% blockId=ModuleWorld_PWM_RGB2 block="RGB|(P12P13P14)|value %value"
    //% weight=1
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB2(value: enColor): void {
		let pin1=DigitalPin.P13;
		let pin2=DigitalPin.P14;
		let pin3=DigitalPin.P12;

        switch (value) {
            case enColor.OFF: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Red: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Green: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Blue: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.White: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Cyan: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Pinkish: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Yellow: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 0);
                break;
            }
        }
    }
	
    //% blockId=ModuleWorld_PWM_Servo block="Servo(360)|pin %ServoNum|value %value"
    //% weight=6
    //% blockGap=20
    //% value.min=0 value.max=360
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Servo(ServoNum: mwServoNum, value: number): void {
		let pin;
		if(ServoNum == 1)	{ pin = AnalogPin.P1; }
		else if(ServoNum == 2)	{ pin = AnalogPin.P4; }
		else if(ServoNum == 3)	{ pin = AnalogPin.P2; }
		else if(ServoNum == 4)	{ pin = AnalogPin.P10; }
		
		pins.servoSetPulse(pin, Math.map(value, 0, 360, 500, 2500))
    }
	
    //% blockId=ModuleWorld_PWM_Servo2 block="Servo(270)|pin %ServoNum|value %value"
    //% weight=6
    //% blockGap=20
    //% value.min=0 value.max=270
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Servo2(ServoNum: mwServoNum, value: number): void {
		let pin;
		if(ServoNum == 1)	{ pin = AnalogPin.P1; }
		else if(ServoNum == 2)	{ pin = AnalogPin.P4; }
		else if(ServoNum == 3)	{ pin = AnalogPin.P2; }
		else if(ServoNum == 4)	{ pin = AnalogPin.P10; }
		
		pins.servoSetPulse(pin, Math.map(value, 0, 270, 500, 2500))
    }



	
}

