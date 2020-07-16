# react-native-quick-controls

## Getting started

`$ npm install react-native-quick-controls --save`

### Mostly automatic installation

`$ react-native link react-native-quick-controls`

## Usage
```javascript
import React from "react"
import { View, Text, Image } from "react-native"
import QuickControls from 'react-native-quick-controls';

const QuickControlsApp = props => {

    return (
        <QuickControls
            duration={300}
            landscapeStyle={{ marginTop: 20 }}
            viewMode={val => console.log(val)}
            portraitEndPoint={0.7}
            landscapeEndPoint={0.5}
            children={
                <View style={{ flex: 1 }}>
                    <Text>This is a children component</Text>
                </View>
            }
            parent={
                <Image 
                    style = {{ alignSelf: 'center', width: 25, height: 50, resizeMode: 'contain' }}
                    source = {{ uri: "https://cdn3.iconfinder.com/data/icons/o-shaped-flag-1/128/O_shaped_asian_flag-21-256.png" }}
                />
            }
            first_action={() => console.log("First action pressed!")}
            first_child={<Image 
                style = {{ alignSelf: 'center', width: 36, height: 36, resizeMode: 'contain' }}
                source = {{ uri: "https://cdn3.iconfinder.com/data/icons/o-shaped-flag-1/128/O_shaped_asian_flag-21-256.png" }}
            />}
            second_action={() => console.log("Second action pressed!")}
            second_child={<Image 
                style = {{ alignSelf: 'center', width: 36, height: 36, resizeMode: 'contain' }}
                source = {{ uri: "https://cdn3.iconfinder.com/data/icons/o-shaped-flag-1/128/O_shaped_asian_flag-27-128.png" }}
            />}
            third_action={() => console.log("Third action pressed!")}
            third_child={<Image 
                style = {{ alignSelf: 'center', width: 36, height: 36, resizeMode: 'contain' }}
                source = {{ uri: "https://cdn3.iconfinder.com/data/icons/o-shaped-flag-1/128/O_shaped_asian_flag-16-256.png" }}
            />}
        />
    )

}
```

## Props

Prop                  | Type      | Required | Default                   | Description
--------------------- | --------- | -------- | ------------------------- | -----------
parent                | component | Yes      |                           | The parent component
first_child           | component | Yes      |                           | The first child to show
first_action          | Action    | Yes      |                           | The action perform after first child clicked
second_child          | component | Yes      |                           | The second child to show
second_action         | Action    | Yes      |                           | The action perform after second child clicked
third_child           | component | Yes      |                           | The third child to show
first_action          | Action    | Yes      |                           | The action perform after third child clicked
duration              | milliseconds      | No       | 500                      | The duration of animation
portraitEndPoint      | double      | No       | 0.7                     | The limit of the menu can reached in portrait mode
landscapeEndPoint     | double      | No       | 0.5                     | The limit of the menu can reached in landscape mode
viewMode              | Function    | No       |                         | Callback function for screen mode changed
commonStyle           | [style](https://reactnative.dev/docs/text-style-props) | No      |                           | Common style for both portrait and landscape mode
portraitStyle           | [style](https://reactnative.dev/docs/text-style-props) | No      |                           | Style for portrait mode
landscapeStyle           | [style](https://reactnative.dev/docs/text-style-props) | No      |                           | Style for landscape mode

---

**MIT Licensed**
