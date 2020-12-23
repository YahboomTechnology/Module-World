/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from chengengyue
*/


//% color="#228B22" weight=25 icon="\uf0b2"
namespace ModuleWorld_Sensor {

    const COLOR_ADD = 0X53;
    const COLOR_REG = 0x00;
    const COLOR_R = 0X10;
    const COLOR_G = 0X0D;
    const COLOR_B = 0x13;

    let initialized = false;
    let val_red = 0;
    let val_green = 0;
    let val_blue = 0;
	
    const STM_ADD = 0X16;
    const ANALOG_ADDR = 0x03;

    export enum mwAnalogNum {
        //% blockId="AnalogNum1" block="AnalogNum1"
        AnalogNum1 = 1,
        //% blockId="AnalogNum2" block="AnalogNum2"
        AnalogNum2 = 2,
        //% blockId="AnalogNum3" block="AnalogNum3"
        AnalogNum3 = 3,
        //% blockId="AnalogNum4" block="AnalogNum4"
        AnalogNum4 = 4
    }	
	
    export enum mwDigitalNum {
        //% blockId="DigitalNum1" block="DigitalNum1"
        DigitalNum1 = 1,
        //% blockId="DigitalNum2" block="DigitalNum2"
        DigitalNum2 = 2,
        //% blockId="DigitalNum3" block="DigitalNum3"
        DigitalNum3 = 3,
        //% blockId="DigitalNum4" block="DigitalNum4"
        DigitalNum4 = 4
    }	
	
    export enum enGetRGB {
        //% blockId="GetValueR" block="GetValueR"
        GetValueR = 0,
        //% blockId="GetValueG" block="GetValueG"
        GetValueG = 1,
        //% blockId="GetValueB" block="GetValueB"
        GetValueB = 2
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

    function i2cWriteData(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function setRegConfig(): void {
        i2cWriteData(COLOR_ADD, COLOR_REG, 0X06);
        i2cWriteData(COLOR_ADD, 0X04, 0X41);
        i2cWriteData(COLOR_ADD, 0x05, 0x01);
    }

    function initColorI2C(): void {
        setRegConfig();
        initialized = true;
    }

    function GetRGB(): void {
        let buff_R = pins.createBuffer(2);
        let buff_G = pins.createBuffer(2);
        let buff_B = pins.createBuffer(2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_R, NumberFormat.UInt8BE);
        buff_R = pins.i2cReadBuffer(COLOR_ADD, 2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_G, NumberFormat.UInt8BE);
        buff_G = pins.i2cReadBuffer(COLOR_ADD, 2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_B, NumberFormat.UInt8BE);
        buff_B = pins.i2cReadBuffer(COLOR_ADD, 2);

        let Red = (buff_R[1] & 0xff) << 8 | (buff_R[0] & 0xff);
        let Green = (buff_G[1] & 0xff) << 8 | (buff_G[0] & 0xff);
        let Blue = (buff_B[1] & 0xff) << 8 | (buff_B[0] & 0xff);

        if (Red > 4500) Red = 2300;
        if (Green > 7600) Green = 4600;
        if (Blue > 4600) Blue = 2700;

        val_red = Math.map(Red, 0, 2300, 0, 255);
        val_green = Math.map(Green, 0, 4600, 0, 255);
        val_blue = Math.map(Blue, 0, 2700, 0, 255);

        if (val_red > 255) val_red = 255;
        if (val_green > 255) val_green = 255;
        if (val_blue > 255) val_blue = 255;

        if (val_red == val_green && val_red == val_blue) {
            val_red = 255;
            val_green = 255;
            val_blue == 255;
        }
        else if (val_red > val_green && val_red > val_blue) {
            val_red = 255;
            val_green /= 2;
            val_blue /= 2;
        }
        else if (val_green > val_red && val_green > val_blue) {
            val_green = 255;
            val_red /= 2;
            val_blue /= 2;
        }
        else if (val_blue > val_red && val_blue > val_green) {
            val_blue = 255;
            val_red /= 2;
            val_green /= 2;
        }
    }


	//% blockId="readdht11" block="value of dht11 %dht11type| at pin %value_DNum"
    //% weight=100
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5 
    export function dht11value(dht11type: DHT11Type, value_DNum: mwDigitalNum): number {
		let dht11pin;
		if(value_DNum == 1)	{ dht11pin = DigitalPin.P12; }
		else if(value_DNum == 2)	{ dht11pin = DigitalPin.P8; }
		else if(value_DNum == 3)	{ dht11pin = DigitalPin.P2; }
		else if(value_DNum == 4)	{ dht11pin = DigitalPin.P1; }
			
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
    //% blockId=ModuleWorld_Sensor_Light block="Light|pin %value_ANum"
    //% weight=100
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5 
    export function Light(value_ANum: mwAnalogNum): number {
        let buf = pins.createBuffer(2);
        buf[0] = ANALOG_ADDR;
        buf[1] = value_ANum;
		pins.i2cWriteBuffer(STM_ADD, buf);
		basic.pause(10)
		let buff_ANALOG = pins.createBuffer(5);
        buff_ANALOG = pins.i2cReadBuffer(STM_ADD, 5);
		basic.pause(10)
		let A1 = (buff_ANALOG[1] << 8) + buff_ANALOG[2];
		//let A2 = (buff_ANALOG[3] << 8) + buff_ANALOG[4];
		
        return A1;
        //return 0;
    }

    //% blockId=ModuleWorld_Sensor_Sound block="Sound|pin %value_ANum"
    //% weight=99
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Sound(value_ANum: mwAnalogNum): number {
        
        let buf = pins.createBuffer(2);
        buf[0] = ANALOG_ADDR;
        buf[1] = value_ANum;
		pins.i2cWriteBuffer(STM_ADD, buf);
		basic.pause(10)
		let buff_ANALOG = pins.createBuffer(5);
        buff_ANALOG = pins.i2cReadBuffer(STM_ADD, 5);
		basic.pause(10)
		let A1 = (buff_ANALOG[1] << 8) + buff_ANALOG[2];
		//let A2 = (buff_ANALOG[3] << 8) + buff_ANALOG[4];
		
        return A1;
    }

    //% blockId=ModuleWorld_Sensor_GetRGBValue block="GetRGBValue|value %value"
    //% blockGap=20
    //% weight=98
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function GetRGBValue(value: enGetRGB): number {
        if (!initialized) {
            initColorI2C();
        }
        GetRGB();
        switch (value) {
            case enGetRGB.GetValueR:
                return val_red;
            case enGetRGB.GetValueG:
                return val_green;
            case enGetRGB.GetValueB:
                return val_blue;
            default:
                break;
        }
        return 0;
    }

    //% blockId=ModuleWorld_Sensor_Ultrasonic block="Ultrasonic|pin %value_DNum"
    //% color="#228B22"
    //% weight=97
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Ultrasonic(value_DNum: mwDigitalNum): number {
        //send pulse
		let Trig,Echo;
		if(value_DNum == 1)	{ Trig = DigitalPin.P12; Echo = DigitalPin.P7; }
		else if(value_DNum == 2)	{ Trig = DigitalPin.P8; Echo = DigitalPin.P4; }
		else if(value_DNum == 3)	{ Trig = DigitalPin.P2; Echo = DigitalPin.P3; }
		else if(value_DNum == 4)	{ Trig = DigitalPin.P1; Echo = DigitalPin.P0; }
		
		
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


    //% blockId=ModuleWorld_Sensor_IR block="IR|pin %value_DNum|value %value"
    //% weight=96
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function IR(value_DNum: mwDigitalNum, value: enObstacle): boolean {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P1; }

        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }

    //% blockId=ModuleWorld_Sensor_PIR block="PIR|pin %value_DNum|value %value"
    //% weight=96
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function PIR(value_DNum: mwDigitalNum, value: enPIR): boolean {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P1; }

        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }
	
    //% blockId=ModuleWorld_Sensor_Button block="Collision|pin %value_DNum|value %value"
    //% weight=3
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Collision(value_DNum: mwDigitalNum, value: enCollision): boolean {
		
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P1; }
		
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }


    //% blockId=ModuleWorld_Sensor_Vibration block="Vibration|pin %value_DNum|get "
    //% weight=1
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Vibration(value_DNum: mwDigitalNum, handle: () => void): void {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P1; }
		
        pins.setPull(pin, PinPullMode.PullUp);
		pins.setEvents(pin, PinEventType.Edge);
		control.onEvent(pin, DAL.MICROBIT_PIN_EVT_FALL, handle);
    }

}

//% color="#C814B8" weight=24 icon="\uf1d4"
namespace ModuleWorld_Display {

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

    export enum enRGBPin {
        //% blockId="RGB1" block="RGB1"
        RGB1 = 1,
        //% blockId="RGB2" block="RGB2"
        RGB2 = 2,
        //% blockId="RGB3" block="RGB3"
        RGB3 = 3
    }
	
    export enum mwPWMNum {
        //% blockId="PWMNum1" block="PWMNum1"
        PWMNum1 = 1,
        //% blockId="PWMNum2" block="PWMNum2"
        PWMNum2 = 2
    }	

	
    let _DEBUG: boolean = false
    const debug = (msg: string) => {
        if (_DEBUG === true) {
            serial.writeLine(msg)
        }
    }

    const CHIP_ADDRESS = 0x40
    const PinRegDistance = 4
    const modeRegister1 = 0x00 // MODE1
    const modeRegister1Default = 0x01
    const channel0OnStepLowByte = 0x06 // LED0_ON_L
    const channel0OnStepHighByte = 0x07 // LED0_ON_H
    const channel0OffStepLowByte = 0x08 // LED0_OFF_L
    const channel0OffStepHighByte = 0x09 // LED0_OFF_H
    const PrescaleReg = 0xFE //the prescale register address
    const allChannelsOnStepLowByte = 0xFA // ALL_LED_ON_L
    const allChannelsOnStepHighByte = 0xFB // ALL_LED_ON_H
    const allChannelsOffStepLowByte = 0xFC // ALL_LED_OFF_L
    const allChannelsOffStepHighByte = 0xFD // ALL_LED_OFF_H
    const sleep = modeRegister1Default | 0x10; // Set sleep bit to 1
    const wake = modeRegister1Default & 0xEF; // Set sleep bit to 0
    const restart = wake | 0x80; // Set restart bit to 1
    const chipResolution = 4096;

    function write(chipAddress: number, register: number, value: number): void {
        const buffer = pins.createBuffer(2)
        buffer[0] = register
        buffer[1] = value
        pins.i2cWriteBuffer(0x40, buffer, false)
    }
    /**
     * Used to set the pulse range (0-4095) of a given pin on the PCA9685
     * @param chipAddress [64-125] The I2C address of your PCA9685; eg: 64
     * @param pinNumber The pin number (0-15) to set the pulse range on
     * @param onStep The range offset (0-4095) to turn the signal on
     * @param offStep The range offset (0-4095) to turn the signal off
     */
    export function setPinPulseRange(pinNumber: number = 0, offStep: number = 2048): void {
		let chipAddress = CHIP_ADDRESS
        let onStep = 0
        pinNumber = Math.max(0, Math.min(15, pinNumber))
        const buffer = pins.createBuffer(2)
        const pinOffset = PinRegDistance * pinNumber
        offStep = Math.max(0, Math.min(4095, offStep))

        debug(`setPinPulseRange(${pinNumber}, ${onStep}, ${offStep}, ${chipAddress})`)
        debug(`  pinOffset ${pinOffset}`)

        // Low byte of onStep
        write(chipAddress, pinOffset + channel0OnStepLowByte, onStep & 0xFF)

        // High byte of onStep
        write(chipAddress, pinOffset + channel0OnStepHighByte, (onStep >> 8) & 0x0F)

        // Low byte of offStep
        write(chipAddress, pinOffset + channel0OffStepLowByte, offStep & 0xFF)

        // High byte of offStep
        write(chipAddress, pinOffset + channel0OffStepHighByte, (offStep >> 8) & 0x0F)
    }
	
    //% blockId=ModuleWorld_Display_RGBinit block="RGB Init"
    //% weight=10
    //% blockGap=21
    export function RGBinit() {
        const buf = pins.createBuffer(2)
        const freq = 50
        const prescaler = (25000000 / (freq * chipResolution)) - 1

        write(64, modeRegister1, sleep)

        write(64, PrescaleReg, prescaler)

        write(64, allChannelsOnStepLowByte, 0x00)
        write(64, allChannelsOnStepHighByte, 0x00)
        write(64, allChannelsOffStepLowByte, 0x00)
        write(64, allChannelsOffStepHighByte, 0x00)

        write(64, modeRegister1, wake)

        control.waitMicros(1000)
        write(64, modeRegister1, restart)
    }

    //% blockId=ModuleWorld_Display_BuzzerPin block="Set Buzzer Pin|%value_PNum"
    //% weight=99
    //% blockGap=22
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function BuzzerPin(value_PNum: mwPWMNum): void {
		
		let pin;
		if(value_PNum == 1)	{ pin = AnalogPin.P14; }
		else if(value_PNum == 2)	{ pin = AnalogPin.P13; }
		
		pins.setAudioPin(pin);
    }

    //% blockId=ModuleWorld_Display_VibrationMot block="Vibration Motor|%value_PNum|speed %speed"
    //% weight=80
    //% blockGap=22
    //% speed.min=0 speed.max=1023
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function VibrationMot(value_PNum: mwPWMNum, speed: number): void {
		
		let pin;
		if(value_PNum == 1)	{ pin = AnalogPin.P14; }
		else if(value_PNum == 2)	{ pin = AnalogPin.P13; }
		
        pins.analogWritePin(pin, speed);
    }
	
    //% blockId=ModuleWorld_Display_RGB block="RGB|pin %pin|value1 %value1|value2 %value2|value3 %value3"
    //% weight=2
    //% blockGap=20
    //% color="#C814B8"
    //% value1.min=0 value1.max=255 value2.min=0 value2.max=255 value3.min=0 value3.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB(pin: enRGBPin, value1: number, value2: number, value3: number): void {
		let pin1,pin2,pin3;
		if(pin == 1){ pin1 = 1; pin2 = 2; pin3 = 0; }
		else if(pin == 2){ pin1 = 4; pin2 = 5; pin3 = 3; }
		else if(pin == 3){ pin1 = 7; pin2 = 8; pin3 = 6; }
		
        setPinPulseRange(pin1, value1 * 16);
        setPinPulseRange(pin2, value2 * 16);
        setPinPulseRange(pin3, value3 * 16);
    }

    //% blockId=ModuleWorld_Display_RGB2 block="RGB|pin %pin|value %value"
    //% weight=1
    //% blockGap=20
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB2(pin: enRGBPin, value: enColor): void {
		let pin1,pin2,pin3;
		if(pin == 1){ pin1 = 1; pin2 = 2; pin3 = 0; }
		else if(pin == 2){ pin1 = 4; pin2 = 5; pin3 = 3; }
		else if(pin == 3){ pin1 = 7; pin2 = 8; pin3 = 6; }

        switch (value) {
            case enColor.OFF: {
                setPinPulseRange(pin1, 0);
                setPinPulseRange(pin2, 0);
                setPinPulseRange(pin3, 0);
                break;
            }
            case enColor.Red: {
                setPinPulseRange(pin1, 4095);
                setPinPulseRange(pin2, 0);
                setPinPulseRange(pin3, 0);
                break;
            }
            case enColor.Green: {
                setPinPulseRange(pin1, 0);
                setPinPulseRange(pin2, 4095);
                setPinPulseRange(pin3, 0);
                break;
            }
            case enColor.Blue: {
                setPinPulseRange(pin1, 0);
                setPinPulseRange(pin2, 0);
                setPinPulseRange(pin3, 4095);
                break;
            }
            case enColor.White: {
                setPinPulseRange(pin1, 4095);
                setPinPulseRange(pin2, 4095);
                setPinPulseRange(pin3, 4095);
                break;
            }
            case enColor.Cyan: {
                setPinPulseRange(pin1, 0);
                setPinPulseRange(pin2, 4095);
                setPinPulseRange(pin3, 4095);
                break;
            }
            case enColor.Pinkish: {
                setPinPulseRange(pin1, 4095);
                setPinPulseRange(pin2, 0);
                setPinPulseRange(pin3, 4095);
                break;
            }
            case enColor.Yellow: {
                setPinPulseRange(pin1, 4095);
                setPinPulseRange(pin2, 4095);
                setPinPulseRange(pin3, 0);
                break;
            }
        }
    }
}

//% color="#ECA40D" weight=22 icon="\uf085"
namespace ModuleWorld_Control {

    const STM_ADD = 0X16;
    const MOT_ADDR = 0x01;
    const MOTSTOP_ADDR = 0X02;
    const ANALOG_ADDR = 0x03;

    export enum mwAnalogNum {
        //% blockId="AnalogNum1" block="AnalogNum1"
        AnalogNum1 = 1,
        //% blockId="AnalogNum2" block="AnalogNum2"
        AnalogNum2 = 2,
        //% blockId="AnalogNum3" block="AnalogNum3"
        AnalogNum3 = 3,
        //% blockId="AnalogNum4" block="AnalogNum4"
        AnalogNum4 = 4
    }	
	
    export enum mwDigitalNum {
        //% blockId="DigitalNum1" block="DigitalNum1"
        DigitalNum1 = 1,
        //% blockId="DigitalNum2" block="DigitalNum2"
        DigitalNum2 = 2,
        //% blockId="DigitalNum3" block="DigitalNum3"
        DigitalNum3 = 3,
        //% blockId="DigitalNum4" block="DigitalNum4"
        DigitalNum4 = 4
    }	
	
	
    export enum mwServoNum {
        //% blockId="ServoNum1" block="ServoNum1"
        ServoNum1 = 1,
        //% blockId="ServoNum2" block="ServoNum2"
        ServoNum2 = 2,
        //% blockId="ServoNum3" block="ServoNum3"
        ServoNum3 = 3,
        //% blockId="ServoNum4" block="ServoNum4"
        ServoNum4 = 4
    }	
	

    export enum mwMotNum {
        //% blockId="MotNum1" block="MotNum1"
        MotNum1 = 1,
        //% blockId="MotNum2" block="MotNum2"
        MotNum2 = 2
    }	

    export enum mwMotSta {
        //% blockId="MotRun" block="MotRun"
        MotRun = 1,
        //% blockId="MotBack" block="MotBack"
        MotBack = 2
    }
	
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

    export enum enButton {
        //% blockId="Press" block="Press"
        Press = 0,
        //% blockId="Realse" block="Realse"
        Realse = 1
    }	
    let _DEBUG: boolean = false
    const debug = (msg: string) => {
        if (_DEBUG === true) {
            serial.writeLine(msg)
        }
    }

    const CHIP_ADDRESS = 0x40
    const PinRegDistance = 4
    const modeRegister1 = 0x00 // MODE1
    const modeRegister1Default = 0x01
    const channel0OnStepLowByte = 0x06 // LED0_ON_L
    const channel0OnStepHighByte = 0x07 // LED0_ON_H
    const channel0OffStepLowByte = 0x08 // LED0_OFF_L
    const channel0OffStepHighByte = 0x09 // LED0_OFF_H
    const PrescaleReg = 0xFE //the prescale register address
    const allChannelsOnStepLowByte = 0xFA // ALL_LED_ON_L
    const allChannelsOnStepHighByte = 0xFB // ALL_LED_ON_H
    const allChannelsOffStepLowByte = 0xFC // ALL_LED_OFF_L
    const allChannelsOffStepHighByte = 0xFD // ALL_LED_OFF_H
    const sleep = modeRegister1Default | 0x10; // Set sleep bit to 1
    const wake = modeRegister1Default & 0xEF; // Set sleep bit to 0
    const restart = wake | 0x80; // Set restart bit to 1
    const chipResolution = 4096;

    function write(chipAddress: number, register: number, value: number): void {
        const buffer = pins.createBuffer(2)
        buffer[0] = register
        buffer[1] = value
        pins.i2cWriteBuffer(0x40, buffer, false)
    }
	
    /**
     * Used to set the pulse range (0-4095) of a given pin on the PCA9685
     * @param chipAddress [64-125] The I2C address of your PCA9685; eg: 64
     * @param pinNumber The pin number (0-15) to set the pulse range on
     * @param onStep The range offset (0-4095) to turn the signal on
     * @param offStep The range offset (0-4095) to turn the signal off
    */
    export function setPinPulseRange(pinNumber: number = 0, offStep: number = 2048): void {
		let chipAddress = CHIP_ADDRESS
        let onStep = 0
        pinNumber = Math.max(0, Math.min(15, pinNumber))
        const buffer = pins.createBuffer(2)
        const pinOffset = PinRegDistance * pinNumber
        offStep = Math.max(0, Math.min(4095, offStep))

        debug(`setPinPulseRange(${pinNumber}, ${onStep}, ${offStep}, ${chipAddress})`)
        debug(`  pinOffset ${pinOffset}`)

        // Low byte of onStep
        write(chipAddress, pinOffset + channel0OnStepLowByte, onStep & 0xFF)

        // High byte of onStep
        write(chipAddress, pinOffset + channel0OnStepHighByte, (onStep >> 8) & 0x0F)

        // Low byte of offStep
        write(chipAddress, pinOffset + channel0OffStepLowByte, offStep & 0xFF)

        // High byte of offStep
        write(chipAddress, pinOffset + channel0OffStepHighByte, (offStep >> 8) & 0x0F)
    } 
	
    //% blockId=ModuleWorld_Control_Servoinit block="Servo Init"
    //% weight=20
    //% blockGap=20
    export function Servoinit() {
        const buf = pins.createBuffer(2)
        const freq = 50
        const prescaler = (25000000 / (freq * chipResolution)) - 1

        write(64, modeRegister1, sleep)

        write(64, PrescaleReg, prescaler)

        write(64, allChannelsOnStepLowByte, 0x00)
        write(64, allChannelsOnStepHighByte, 0x00)
        write(64, allChannelsOffStepLowByte, 0x00)
        write(64, allChannelsOffStepHighByte, 0x00)

        write(64, modeRegister1, wake)

        control.waitMicros(1000)
        write(64, modeRegister1, restart)
    }
	
	//% blockId=ModuleWorld_Control_Potentiometer block="Potentiometer|pin %value_ANum"
    //% weight=2
    //% blockGap=20
    //% color="#b87b00"
    //% name.fieldEditor="gridpicker" name.fieldOption.columns=5
    export function Potentiometer(value_ANum: mwAnalogNum): number {
		
        let buf = pins.createBuffer(2);
        buf[0] = ANALOG_ADDR;
        buf[1] = value_ANum;
		pins.i2cWriteBuffer(STM_ADD, buf);
		basic.pause(10)
		let buff_ANALOG = pins.createBuffer(5);
        buff_ANALOG = pins.i2cReadBuffer(STM_ADD, 5);
		basic.pause(10)
		let A1 = (buff_ANALOG[1] << 8) + buff_ANALOG[2];
		//let A2 = (buff_ANALOG[3] << 8) + buff_ANALOG[4];
		
        return A1;
    }
    //% blockId=ModuleWorld_Control_Servo block="Servo|pin %pin|value %value"
    //% weight=6
    //% blockGap=20
    //% value.min=0 value.max=360
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Servo(pin: mwServoNum, value: number): void {
		pin = 13 - pin;
		setPinPulseRange(pin, Math.map(value, 0, 359, 105, 545));
    }

    //% blockId=ModuleWorld_Control_MotorRun block="Motor|%value_num|%value_sta|speed %speed"
    //% weight=5
    //% blockGap=20
    //% speed.min=0 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function MotorRun(value_num: mwMotNum, value_sta: mwMotSta, speed: number): void {
		
        let buf = pins.createBuffer(4);
        buf[0] = MOT_ADDR;
        buf[1] = value_num;
        buf[2] = value_sta;
        buf[3] = speed;
		pins.i2cWriteBuffer(STM_ADD, buf);
		
    }

    //% blockId=ModuleWorld_Control_MotorStop block="MotorStop"
    //% weight=4
    //% blockGap=20
    export function MotorStop(): void {
        let buf = pins.createBuffer(2);
        buf[0] = MOTSTOP_ADDR;
        buf[1] = 0;
        pins.i2cWriteBuffer(STM_ADD, buf);
    }

    //% blockId=ModuleWorld_Control_Rocker block="Rocker|pin %value_ANum|value %value"
    //% weight=1
    //% blockGap=20
    //% color="#b87b00"
    export function Rocker(value_ANum: mwAnalogNum, value: enRocker): boolean {
		
        let buf = pins.createBuffer(2);
        buf[0] = ANALOG_ADDR;
        buf[1] = value_ANum;
		pins.i2cWriteBuffer(STM_ADD, buf);
		basic.pause(10)
		let buff_ANALOG = pins.createBuffer(5);
        buff_ANALOG = pins.i2cReadBuffer(STM_ADD, 5);
		basic.pause(10)
		let x = (buff_ANALOG[1] << 8) + buff_ANALOG[2];
		let y = (buff_ANALOG[3] << 8) + buff_ANALOG[4];
		
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

    //% blockId=ModuleWorld_Control_Button block="Button|pin %value_DNum|value %value"
    //% weight=3
    //% blockGap=20
    //% color="#b87b00"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Button(value_DNum: mwDigitalNum, value: enButton): boolean {
		
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P12; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P8; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P2; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P1; }
		
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }
	
}

