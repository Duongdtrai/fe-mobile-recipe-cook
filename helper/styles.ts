import { Platform } from "react-native"

export const styleIOS = (stylesCss: any, styleIOS: any) => {
    return {
        ...stylesCss,
        ...Platform.select({
            ios: styleIOS
        })
    }
}