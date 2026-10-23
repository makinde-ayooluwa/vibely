import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const CustomView = ({ safe, scroll, flex, children, style, ...props }) => {
    if(!safe && !scroll && !flex){
        return <View style={[{}, style]} {...props}>
            {children}
        </View>
    }
    return (
        <>
            {
                scroll ?
                    (
                        <>
                            <ScrollView style={[{}, style]} {...props}>
                                {
                                    safe ?
                                        <SafeAreaView>
                                            {children}
                                        </SafeAreaView>
                                        :
                                        <View>
                                            {children}
                                        </View>
                                }
                            </ScrollView>
                        </>
                    )
                    :
                    <>
                        {
                            safe ?
                                <SafeAreaView style={[{}, style]} {...props}>
                                    <View style={[flex && { flex: 1 },]}>
                                        {children}
                                    </View>
                                </SafeAreaView>
                                :
                                <View style={[{}, style]} {...props}>
                                    {children}
                                </View>
                        }
                    </>
            }
        </>
    )
}

export default CustomView