// components/TabBar.tsx
import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteNavbar } from '@/ts/interface';
import { Ionicons } from '@expo/vector-icons';
import { connect, useDispatch } from 'react-redux';
import { mapStateToProps } from '@/constants/mapStateToProps';
import { changeTab } from '@/redux/actions/tabActions';
import { styleIOS } from '@/helper/styles';

const TabBar = (props: any) => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { tabState, state } = props;
    const [isFocused, setIsFocused] = useState<number>(tabState.index);

    useEffect(() => {
        setIsFocused(tabState.index);
    }, [tabState.index])

    return (
        <View style={styles.tabBar}>
            {state.routes.map((route: RouteNavbar, index: number) => {
                const onPress = (index: number) => {
                    setIsFocused(index);
                    dispatch(changeTab(index));
                    navigation.navigate(route.key);
                };

                return (
                    <Pressable
                        key={index}
                        onPress={() => isFocused !== index && onPress(index)}
                        style={({ pressed }) => [
                            styleIOS(styles.tab, styles.tabIOS),
                            { backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'white' },
                        ]}
                    >
                        <Ionicons name={route.iconName} size={Platform.OS === "ios" ? 25 : 30} color= {isFocused === index ? "gold" : "black"} />
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    tabIOS: {
        padding: 12
    }
});

export default connect(mapStateToProps)(TabBar);
