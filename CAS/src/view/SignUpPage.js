import React from "react";
import { Text } from "react-native";
import * as StyleUtil from "../util/StyleUtil";
import * as StringUtil from "../util/StringUtil";
import BaseComponent from "./BaseComponent";
import * as ViewUtil from "../util/ViewUtil";
import * as SecretAsync from "../api/common/SecretAsync";
import BaseCommon from "../common/BaseCommon";
import * as ColorUtil from "../util/ColorUtil";
import MyViewComponent from "../component/MyViewComponent";
import MyScrollViewComponent from "../component/MyScrollViewComponent";
import LabelWithInputSingleLineNormalNoBorder from "../component/LabelWithInputSingleLineNormalNoBorderComponent";
import MyButtonComponent from "../component/MyButtonComponent";
import { Actions } from "react-native-router-flux";
import HeaderNormalWithRightButtonComponent from "../component/HeaderNormalWithRightButtonComponent";
import { List, Radio } from "antd-mobile";
import * as ApiUtil from "../api/common/ApiUtil";
const RadioItem = Radio.RadioItem;
export default class SignUpPage extends BaseComponent {


    // 构造
    constructor(props) {
        super(props);
        this.baseCommon = new BaseCommon({ ...props, backPress : (e) => this.onBackPress(e) });
        // 初始状态
        this.state = {
            value : 2,  //1-老师,2-学生，
            name : '',
            telephone : '',
            password : '',
            password2 : '',
        };
    }

    onBackPress(e) {
        return false;
    }

    componentDidMount() {
        super.componentDidMount();
        this.baseCommon.componentDidMount();
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.baseCommon.componentWillUnmount();

    }

    checkInfo() {
        if (this.state.name == '' || StringUtil.trim(this.state.name).length == 0) {
            ViewUtil.showToast('Input Name');
            return false;
        }
        if (this.state.telephone == '' || StringUtil.trim(this.state.telephone).length == 0) {
            ViewUtil.showToast('Input Id');
            return false;
        }

        if (this.state.password == '' || StringUtil.trim(this.state.password).length < 6) {
            ViewUtil.showToast('Input Password length >= 6');
            return false;
        }
        if (this.state.password2 == '' || StringUtil.trim(this.state.password2).length < 6) {
            ViewUtil.showToast('Input Password Again');
            return false;
        }
        if (this.state.password != this.state.password2) {
            ViewUtil.showToast('Two Passwords are different');
            return false;
        }
        return true;
    }

    onPressSignUpCallback(json) {
        if (json.code != ApiUtil.http.ERROR_CODE_SUCCESS_0) {
            ViewUtil.dismissToastLoading();
            //处理自定义异常
            SecretAsync.onCustomExceptionNormal(json);

            return;

        }

        ViewUtil.showToast('Success');
        Actions.pop();

        return;
    }

    onPressSignUp() {

        if (!this.checkInfo()) {
            return;
        }

        let bodyObj = {
            api_name : 'home.register.index',
            username : this.state.name.trim(),
            phone : this.state.telephone.trim(),
            password : this.state.password.trim(),
            role : this.state.value,

        };
        SecretAsync.postWithCommonErrorShow((jsonObj) => {
            this.onPressSignUpCallback(jsonObj);
        }, bodyObj);

    }

    componentWillMount() {
        super.componentWillMount();
        this.baseCommon.componentWillMount();

    }

    onChange = (value) => {
        console.log('checkbox');
        this.setState({
            value,
        });
    };

    render() {
        const { value, } = this.state;
        const data = [
            { value : 2, label : 'Student' },
            { value : 1, label : 'Lecturer' },
        ];

        return (
            <MyViewComponent style={{ backgroundColor : ColorUtil.bgGray, flex : 1, }}>

                {ViewUtil.getViewStatusBar()}
                <HeaderNormalWithRightButtonComponent
                    textCenter={'Register'}
                    _leftBtnShouldShow={true}
                />
                <MyScrollViewComponent
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}

                    contentContainerStyle={{
                        justifyContent : 'center',
                        alignItems : 'stretch',
                    }}>

                    <MyViewComponent
                        style={[ StyleUtil.gStyles.gFlex1, StyleUtil.gStyles.gBgWhite, StyleUtil.gStyles.gCardBgWhite ]}>

                        <List>
                            {data.map(i => (
                                <RadioItem key={i.value} checked={value === i.value} onChange={() => this.onChange(i.value)}>
                                    {i.label}
                                </RadioItem>
                            ))}

                            <List.Item>

                                <LabelWithInputSingleLineNormalNoBorder _labelContent={'Name        '}
                                                                        _inputValue={this.state.name}
                                                                        _onChange={(value) => {
                                                                            this.baseCommon.mounted && this.setState({ name : value });
                                                                        }}
                                />
                            </List.Item>

                            <List.Item>
                                <LabelWithInputSingleLineNormalNoBorder _labelContent={'Id        '}
                                                                        _inputValue={this.state.telephone}
                                                                        _onChange={(value) => {
                                                                            this.baseCommon.mounted && this.setState({ telephone : value });
                                                                        }}
                                />
                            </List.Item>

                            <List.Item>
                                <LabelWithInputSingleLineNormalNoBorder _labelContent={'Password        '} _inputPlaceHolder={'Length >= 6'}
                                                                        _type={'password'}
                                                                        _inputValue={this.state.password}
                                                                        _onChange={(value) => {
                                                                            this.baseCommon.mounted && this.setState({ password : value });
                                                                        }}
                                />
                            </List.Item>

                            <List.Item>
                                <LabelWithInputSingleLineNormalNoBorder _labelContent={'Verify Password'} _inputPlaceHolder={'Length >= 6'}
                                                                        _type={'password'}
                                                                        _inputValue={this.state.password2}
                                                                        _onChange={(value) => {
                                                                            this.baseCommon.mounted && this.setState({ password2 : value });
                                                                        }}
                                />
                            </List.Item>

                        </List>

                        <MyButtonComponent
                            style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                marginBottom : 20,
                                marginTop : 40,
                            }, ]}
                            type={'primary'}
                            onPress={() => {
                                this.onPressSignUp();
                            }}
                        >
                            <Text> Register </Text>
                        </MyButtonComponent>

                    </MyViewComponent>

                </MyScrollViewComponent>

            </MyViewComponent>
        );
    }

}

