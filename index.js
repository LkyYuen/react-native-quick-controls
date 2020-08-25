import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Animated, Dimensions, Image, TouchableOpacity, PanResponder, Platform, StatusBar } from "react-native"
import { Button } from "native-base"
import { Easing } from "react-native-reanimated";
import Orientation from 'react-native-orientation-locker';

const QuickControl = props => {

    const checkPortraitScrollLimit = (val = 0.7) => {
        if (val > 1 || val < 0) {
            return 0.7
        }
        return val
    }

    const checkLandscapeScrollLimit = (val = 0.5) => {
        if (val > 1 || val < 0) {
            return 0.5
        }
        return val
    }

    const [topSpacing, setTopSpacing] = useState(Platform.OS == 'ios' ? 16 : 0);
    const [screenLayout, setScreenLayout] = useState("portrait");
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
    const [inputRange, setInputRange] = useState([screenHeight * 0.1 + topSpacing, screenLayout == "landscape" ? screenHeight * 0.4 : screenHeight * checkPortraitScrollLimit(props.portraitEndPoint)]);
    const [outputRange, setOutputRange] = useState([screenHeight * 0.1 + topSpacing, screenLayout == "landscape" ? screenHeight * 0.4 : screenHeight * checkPortraitScrollLimit(props.portraitEndPoint)]);

    let _val = { x: 0, y: 0 };
    const pan = useRef(new Animated.ValueXY()).current;
    // pan.addListener((value) => _val = value);
    const [translateAnimatedValue, setTranslateAnimatedValue] = useState(new Animated.Value(0));
    const [rotateAnimatedValue, setRotateAnimatedValue] = useState(new Animated.Value(0));
    const [scaleAnimatedValue, setScaleAnimatedValue] = useState(new Animated.Value(0));
    const [closeButtonExpanded, setCloseButtonExpanded] = useState(false);

    const panResponder = useMemo(
        () => PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                const { dx, dy } = gestureState
                return (dx > 2 || dx < -2 || dy > 2 || dy < -2)
            },
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
                const { dx, dy } = gestureState
                return (dx > 2 || dx < -2 || dy > 2 || dy < -2)
            },
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value
                });
                pan.setValue({ x: 0, y: 0 })
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: 0, dy: pan.y }
                ], 
                {
                    useNativeDriver: false
                }
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset();
            }
        }),
    []);

    useEffect(() => {
        Animated.timing(
            translateAnimatedValue,
            { 
                toValue: closeButtonExpanded ? 1 : 0,
                easing: Easing.in,
                useNativeDriver: true,
                duration: props.duration || 500
            }
        ).start();

        Animated.timing(
            rotateAnimatedValue,
            { 
                toValue: closeButtonExpanded ? 1 : 0,
                easing: Easing.in,
                useNativeDriver: true,
                duration: props.duration || 500
            }
        ).start();

        Animated.timing(
            scaleAnimatedValue,
            { 
                toValue: closeButtonExpanded ? 1 : 0,
                easing: Easing.in,
                useNativeDriver: true,
                duration: props.duration || 500
            }
        ).start();

    }, [closeButtonExpanded]);

    useEffect(() => {
        if (screenLayout == "portrait") {
            setInputRange([screenHeight * 0.1 + topSpacing, screenHeight * checkPortraitScrollLimit(props.portraitEndPoint)])
            setOutputRange([screenHeight * 0.1 + topSpacing, screenHeight * checkPortraitScrollLimit(props.portraitEndPoint)])
        }
        else {
            setInputRange([screenHeight * 0.1 + topSpacing, screenHeight * checkLandscapeScrollLimit(props.landscapeEndPoint)])
            setOutputRange([screenHeight * 0.1 + topSpacing, screenHeight * checkLandscapeScrollLimit(props.landscapeEndPoint)])
        }
        _val = { x: 0, y: 0 };
        pan.setOffset({ x: 0, y: 0 });
        Animated.spring(						
            pan,				 
            {
                toValue: { x: 0, y: 0 },
                easing: Easing.in,
                useNativeDriver: true
            }		 
        ).start();
    }, [screenLayout])

    Orientation.unlockAllOrientations();

    useEffect(() => {
        return () => Orientation.removeAllListeners();
    }, []);

    const detectOrientation = (e = null) => {
        const width = e ? e.nativeEvent.layout.width : 0;
        const height = e ? e.nativeEvent.layout.height : 1;

        setScreenHeight(height);
    
        if (width > height) {
            setScreenLayout("landscape");
            props.viewMode != undefined && props.viewMode("landscape");
        }
        else {
            setScreenLayout("portrait");
            props.viewMode != undefined && props.viewMode("portrait");
        }
    };

    const handlePressReleased = () => {
        StatusBar.setHidden(false, "slide")
        setCloseButtonExpanded(false)
    }

    const triggerButton = () => {
        setCloseButtonExpanded(!closeButtonExpanded)
    }

    return (
        <View style={[props.commonStyle, screenLayout === "landscape" ? props.landscapeStyle : props.portraitStyle]} onLayout={e => detectOrientation(e)}>
            {props.children}
            {
                <Animated.View
                    {...panResponder.panHandlers}
                    style={{
                        width: closeButtonExpanded ? 80 : 25,
                        height: 110,
                        position: 'absolute',
                        top: topSpacing + 40,
                        bottom: 100,
                        right: -2,
                        zIndex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        transform: [{
                            translateY: pan.y.interpolate({
                                inputRange: inputRange,
                                outputRange: outputRange,
                                extrapolate: 'clamp'
                            })
                        }],
                    }}
                >
                    <Button
                        transparent
                        small
                        style = {{ 
                            padding: 0,
                            width: 25, 
                            height: 80,
                        }}
                        onPress={triggerButton}
                    >
                        {props.parent}
                    </Button>

                    <Animated.View style={{
                        width: 36,
                        height: 36,
                        position: 'absolute',
                        top: '38%', 
                        right: 0,
                        zIndex: 2,
                        transform: [{
                            translateX: translateAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -21]
                            })
                        },{
                            translateY: translateAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -43]
                            })
                        },{
                            rotate: rotateAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })
                        },{
                            scaleX: scaleAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.01, 1]
                            })
                        },{
                            scaleY: scaleAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.01, 1]
                            })
                        }]
                    }}>
                        <TouchableOpacity
                            style = {{ padding: 0 }}
                            onPressIn = {props.first_action}
                            onPressOut={handlePressReleased}
                        >
                            {props.first_child}
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{
                        width: 36,
                        height: 36,
                        position: 'absolute',
                        top: '34%', 
                        right: 0,
                        zIndex: 2,
                        transform: [{
                            translateX: translateAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -43]
                            })
                        },{
                            rotate: rotateAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })
                        },{
                            scaleX: scaleAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.01, 1]
                            })
                        },{
                            scaleY: scaleAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.01, 1]
                            })
                        }]
                    }}>
                        <TouchableOpacity
                            style = {{ padding: 0 }}
                            onPressIn = {props.second_action}
                            onPressOut={handlePressReleased}
                        >
                            {props.second_child}
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{
                        width: 36,
                        height: 36,
                        position: 'absolute', 
                        top: '30%',
                        right: 0,
                        zIndex: 2,
                        transform: [{
                            translateX: translateAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -21]
                            })
                        },{
                            translateY: translateAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 43]
                            })
                        },{
                            rotate: rotateAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })
                        },{
                            scaleX: scaleAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.01, 1]
                            })
                        },{
                            scaleY: scaleAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.01, 1]
                            })
                        }]
                    }}>
                        <TouchableOpacity
                            style = {{ padding: 0 }}
                            onPressIn = {props.third_action}
                            onPressOut={handlePressReleased}
                        >
                            {props.third_child}
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            }
            {
                closeButtonExpanded ? 
                    <TouchableOpacity
                        style = {{ 
                            position: 'absolute',
                            right: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'transparent'
                        }}
                        onPress = {() => setCloseButtonExpanded(!closeButtonExpanded) } />
                : <View /> 
            }
        </View>
    )
}

export default QuickControl;