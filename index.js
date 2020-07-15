import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, Dimensions, Image, TouchableOpacity, PanResponder, Platform } from "react-native"
import { Easing } from "react-native-reanimated";
import Orientation from 'react-native-orientation-locker';

const QuickControl = props => {

    const checkPortraitScrollLimit = (val = 0.7) => {
        if (val > 1) {
            return 0.7
        }
        return val
    }

    const checkLandscapeScrollLimit = (val = 0.5) => {
        if (val > 1) {
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
    pan.addListener((value) => _val = value);
    const [translateAnimatedValue, setTranslateAnimatedValue] = useState(new Animated.Value(0));
    const [rotateAnimatedValue, setRotateAnimatedValue] = useState(new Animated.Value(0));
    const [scaleAnimatedValue, setScaleAnimatedValue] = useState(new Animated.Value(0));
    const [closeButtonExpanded, setCloseButtonExpanded] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                const { dx, dy } = gestureState
                return (dx > 2 || dx < -2 || dy > 2 || dy < -2)
            },
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
                const { dx, dy } = gestureState
                return (dx > 2 || dx < -2 || dy > 2 || dy < -2)
            },
            onPanResponderMove: Animated.event([
                null, { dx: 0, dy: pan.y }
            ], {
                useNativeDriver: false
            }),
            onPanResponderGrant: () => {
                pan.setOffset({ x: _val.x, y: _val.y });
                pan.setValue({ x: 0, y: 0 });
            },
        })
    ).current;

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
        pan.setOffset({ x: _val.x, y: _val.y });
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
        }
        else {
            setScreenLayout("portrait");
        }
    };

    return (
        <View style={{ flex: 1 }} onLayout={e => detectOrientation(e)}>
            {
                <Animated.View
                    {...panResponder.panHandlers}
                    style={{
                        width: 80,
                        height: 120,
                        position: 'absolute',
                        top: topSpacing + 40,
                        bottom: 100,
                        right: -1,
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
                    <TouchableOpacity
                        style = {{ 
                            padding: 0, 
                            width: 25, 
                            height: 50,
                        }}
                        onPress={() => setCloseButtonExpanded(!closeButtonExpanded)}
                    >
                        {props.parent}
                    </TouchableOpacity>
                    
                    <Animated.View style={{
                        width: 36,
                        height: 36,
                        position: 'absolute',
                        top: '35%', 
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
                            onPress = {props.first_action}>
                            {props.first_child}
                            {/* <Image 
                                style = {{ alignSelf: 'center', width: 36, height: 36, resizeMode: 'contain' }}
                                source = { props.actions[0].local ? props.actions[0].image : { uri: props.actions[0].image } }
                            /> */}
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{
                        width: 36,
                        height: 36,
                        position: 'absolute',
                        top: '35%', 
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
                            onPress = {props.second_action}>
                                {props.second_child}
                            {/* <Image 
                                style = {{ alignSelf: 'center', width: 36, height: 36, resizeMode: 'contain' }}
                                source = { props.actions[1].local ? props.actions[1].image : { uri: props.actions[1].image } }
                            /> */}
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{
                        width: 36,
                        height: 36,
                        position: 'absolute',
                        top: '35%', 
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
                            onPress = {props.third_action}>
                            {props.third_child}
                            {/* <Image 
                                style = {{ alignSelf: 'center', width: 36, height: 36, resizeMode: 'contain' }}
                                source = { props.actions[2].local ? props.actions[2].image : { uri: props.actions[2].image } }
                            /> */}
                        </TouchableOpacity>
                    </Animated.View>

                </Animated.View>
            }
            {
                closeButtonExpanded ? 
                    <TouchableOpacity
                        style = {{ 
                            position: 'absolute',
                            top: '5%', 
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