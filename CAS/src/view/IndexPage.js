import React from "react";
import { BackHandler, Text } from "react-native";
import * as StyleUtil from "../util/StyleUtil";
import BaseComponent from "./BaseComponent";
import * as ViewUtil from "../util/ViewUtil";
import BaseCommon from "../common/BaseCommon";
import * as ColorUtil from "../util/ColorUtil";
import MyViewComponent from "../component/MyViewComponent";
import MyScrollViewComponent from "../component/MyScrollViewComponent";
import MyButtonComponent from "../component/MyButtonComponent";
import { Actions } from "react-native-router-flux";
import HeaderNormalWithRightButtonComponent from "../component/HeaderNormalWithRightButtonComponent";
import AMapLocationUtil from "../util/AMapLocationUtil";
import PropTypes from "prop-types";
import * as ConstantUtil from "../util/ConstantUtil";
import * as SecretAsync from "../api/common/SecretAsync";
import * as ApiUtil from "../api/common/ApiUtil";
import Requestor from './Requestor';

var ImagePicker = require('react-native-image-picker');
let face_api_base_url = 'https://westcentralus.api.cognitive.microsoft.com';
const api_key = '1bbe9de7486c44da8afefa78cbdaa277';
let persongroup_data = {
    name: 'persongroup_name'
}
let person_data = {
    name: 'alex'
}
const image_picker_options = {
    title: 'Select Photo',
    takePhotoButtonTitle: 'Take Photo...',
    // chooseFromLibraryButtonTitle: 'Choose from Library...',
    cameraType: 'back',
    mediaType: 'photo',
    maxWidth: 480,
    quality: 1,
    noData: false,
};

export default class IndexPage extends BaseComponent {

    static propTypes = {
        role : PropTypes.string, //

    };

    static defaultProps = {
        role : '2', //1-老师，2-学生
    };

    // 构造
    constructor(props) {
        super(props);
        this.baseCommon = new BaseCommon({ ...props, backPress : (e) => this.onBackPress(e) });
        // 初始状态
        this.state = {
            name: '',
            photo_style: {
                width: 480,
                height: 480
            },
            photo: null,
            similar_photo: null,
            message: '',
            person_id: '',
            persistedFaceId: ''
        };
    }

    onBackPress(e) {
        console.log('Press Back Btn Again to Exit App');
        console.log('lastBackTime', lastBackTime);

        if ((lastBackTime + 2000) >= Date.now()) {
            BackHandler.exitApp();
            return true;
        }
        // 此处可以根据情况实现 点2次就退出应用，或者弹出rn视图等
        //记录点击返回键的时间
        lastBackTime = Date.now();
        console.log('lastBackTime2', lastBackTime);

        ViewUtil.showToast('Press Back Btn Again to Exit App');
        console.log('Press Back Btn Again to Exit App');
        return true;
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

    componentWillMount() {
        super.componentWillMount();
        this.baseCommon.componentWillMount();
        console.log(global.gUserInfo);

    }

    onOkScanCallBack(json) {
        if (json.code != ApiUtil.http.ERROR_CODE_SUCCESS_0) {
            ViewUtil.dismissToastLoading();
            //处理自定义异常
            SecretAsync.onCustomExceptionNormal(json);

            return;

        }
        ViewUtil.showToast(ConstantUtil.toastDoSuccess);
        // Actions.pop();
    }

    checkInfo() {

        if (TmpDataUtil.curLongitude == '') {
            ViewUtil.showToast('Get Location Failed');
            return false;
        }
        return true;
    }

    onOkScan(value) {

        if (!this.checkInfo()) {
            return;
        }

        ViewUtil.showToastLoading();

        //发布课程
        let bodyObj = {
            api_name : 'student.sign.scanning',
            qrcode : value,
            longitude : TmpDataUtil.curLongitude,
            latitude : TmpDataUtil.curLatitude,
            address : '1',

        };
        SecretAsync.postWithCommonErrorShow((jsonObj) => {
            this.onOkScanCallBack(jsonObj);
        }, bodyObj);

    }

    onPressSignScan() {

            this.onPressSignGPS();

            let bodyObj = {};
            Actions.ShowScanPage({
                onReadData : (value) => {
                    console.log(value);
                    this.onOkScan(value);
                }
            });


    }

    onPressSignGPS() {

        let bodyObj = {};
        TmpDataUtil.curLongitude = '';
        TmpDataUtil.curLatitude = '';
        this.amapLocationUtil = new AMapLocationUtil({
            _onRequestLocationOk : () => {
                LOG(22);
                LOG(TmpDataUtil.curLatitude);
            }
        });
        this.amapLocationUtil._showLocation();
    }

    render() {
        return (
            <MyViewComponent style={{ backgroundColor : ColorUtil.bgGray, flex : 1, }}>

                {ViewUtil.getViewStatusBar()}
                <HeaderNormalWithRightButtonComponent textCenter={'Main Page'}
                                                      _leftBtnShouldShow={true}
                                                      _rightBtnShouldShow={false}
                                                      _textBtn={'btn'}
                                                      _onPressBtn={() => {
                                                          console.log(123);
                                                          Actions.ModifyPassPage();
                                                      }}

                />
                <MyScrollViewComponent
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}

                    contentContainerStyle={{
                        justifyContent : 'center',
                        alignItems : 'stretch',
                    }}>

                    <MyViewComponent
                        style={[ StyleUtil.gStyles.gPadding20, StyleUtil.gStyles.gFlex1, StyleUtil.gStyles.gBgWhite, StyleUtil.gStyles.gCardBgWhite ]}>

                        <Text style={{ textAlign : 'center', }}> {gUserInfo.user_name} </Text>

                        {
                            gUserInfo && gUserInfo.role == '1'
                                ? <MyViewComponent>

                                <MyButtonComponent
                                    style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                        marginBottom : 20,
                                        marginTop : 40,
                                    }, ]}
                                    type={'primary'}
                                    onPress={() => {
                                        Actions.PublicCoursePage();
                                    }}
                                >
                                    <Text> Take Attendance </Text>
                                </MyButtonComponent>
                                <MyButtonComponent
                                    style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                        marginBottom : 20,
                                        marginTop : 40,
                                    }, ]}
                                    type={'primary'}
                                    onPress={() => {
                                        Actions.MyCourseListManagePage({ typePage : ConstantUtil.typePageReleasedCourse });
                                    }}
                                >
                                    <Text> Checking-In Lecture </Text>
                                </MyButtonComponent>
                                <MyButtonComponent
                                    style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                        marginBottom : 20,
                                        marginTop : 40,
                                    }, ]}
                                    type={'primary'}
                                    onPress={() => {
                                        Actions.MyCourseListManagePage({ typePage : ConstantUtil.typePageManageMyCourse });
                                    }}
                                >
                                    <Text> My Courses </Text>
                                </MyButtonComponent>

                            </MyViewComponent>
                                : <MyViewComponent>
                                <MyButtonComponent
                                    style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                        marginBottom : 20,
                                        marginTop : 40,
                                    }, ]}
                                    type={'primary'}
                                    onPress={() => {
                                        this.onPressSignScan();
                                    }}
                                >
                                    <Text> Scan to Check In </Text>
                                </MyButtonComponent>

                                {/*<MyButtonComponent*/}
                                {/*style={[ StyleUtil.gStyles.gButtonBlueDefault, {*/}
                                {/*marginBottom : 20,*/}
                                {/*marginTop : 40,*/}
                                {/*}, ]}*/}
                                {/*type={'primary'}*/}
                                {/*onPress={() => {*/}
                                {/*this.onPressSignGPS();*/}
                                {/*}}*/}
                                {/*>*/}
                                {/*<Text> GPS签到 </Text>*/}
                                {/*</MyButtonComponent>*/}

                                <MyButtonComponent
                                    style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                        marginBottom : 20,
                                        marginTop : 40,
                                    }, ]}
                                    type={'primary'}
                                    onPress={() => {
                                        Actions.MyCourseListManagePage({ typePage : ConstantUtil.typePageSelectSigningCourse });
                                    }}
                                >
                                    <Text> Checking-In Lectures </Text>
                                </MyButtonComponent>

                                <MyButtonComponent
                                    style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                        marginBottom : 20,
                                        marginTop : 40,
                                    }, ]}
                                    type={'primary'}
                                    onPress={() => {
                                        Actions.MyCourseListManagePage({ typePage : ConstantUtil.typePageSelectSignedCourse });
                                    }}
                                >
                                    <Text> Checked-In Lectures </Text>
                                </MyButtonComponent>
                            </MyViewComponent>
                        }

                        <MyButtonComponent
                            style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                marginBottom : 20,
                                marginTop : 40,
                            }, ]}
                            type={'primary'}
                            onPress={() => {
                                Actions.ModifyPassPage();
                            }}
                        >
                            <Text> Modify Password </Text>
                        </MyButtonComponent>

                        <MyButtonComponent
                            style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                marginBottom : 20,
                                marginTop : 40,
                            }, ]}
                            type={'primary'}
                            onPress={() => {
                                this._upLoadFace();
                            }}
                        >
                            <Text> Upload Face </Text>
                        </MyButtonComponent>

                        <MyButtonComponent
                            style={[ StyleUtil.gStyles.gButtonBlueDefault, {
                                marginBottom : 20,
                                marginTop : 40,
                            }, ]}
                            type={'primary'}
                            onPress={() => {
                                ViewUtil.popAllAndToLogin();
                            }}
                        >
                            <Text> Logout </Text>
                        </MyButtonComponent>

                    </MyViewComponent>

                </MyScrollViewComponent>

            </MyViewComponent>
        );
    }

    _pickImage() {

        ImagePicker.showImagePicker(image_picker_options, (response) => {

            if (response.error) {
                alert('Error getting the image. Please try again.');
            } else {

                let source = {uri: response.uri};

                this.setState({
                    photo_style: {
                        width: response.width,
                        height: response.height
                    },
                    photo: source,
                    photo_data: response.data
                });
                this._createPersonGroup();
            }
        });
    }

    _createPersonGroup() {

        Requestor.request(
            face_api_base_url + '/face/v1.0/persongroups/' + gUserInfo.user_name,
            'PUT',
            api_key,
            JSON.stringify(persongroup_data)
        )
            .then(function (res) {
                // console.log(res);
                alert('Person Group Created!');
            });

        Requestor.request(
            face_api_base_url + '/face/v1.0/persongroups/' + gUserInfo.user_name + '/persons',
            'POST',
            api_key,
            JSON.stringify(person_data)
        )
            .then(
                (res) => {
                    console.log(res['personId']);

                    this.setState({
                        person_id: res['personId']
                    });
                    this._addFaceToPersonGroup();
                }

            )
            .catch(function (error) {
                console.log(error);
            });

    }

    _addFaceToPersonGroup() {

        var user_data = {
            name: this.state.name,
            filename: this.state.photo.uri
        };

        Requestor.upload(
            face_api_base_url + '/face/v1.0/persongroups/' + gUserInfo.user_name + '/persons/' + this.state.person_id + '/persistedFaces',
            api_key,
            this.state.photo_data,
            {
                userData: JSON.stringify(user_data)
            }
        )
            .then((res) => {
                console.log(res);

                alert('Face Photo Upload!');

                this.setState({
                    persistedFaceId: res['persistedFaceId']
                });

                alert('Face was added to person group!');

            });

    }

    _upLoadFace(){
        this._pickImage();
        // this._createPersonGroup();
        // this._addFaceToPersonGroup();
    }

    _verifyFace() {

        ImagePicker.showImagePicker(image_picker_options, (response) => {

            if (response.error) {
                alert('Error getting the image. Please try again.');
            } else {

                let source = {uri: response.uri};

                this.setState({
                    photo_style: {
                        width: response.width,
                        height: response.height
                    },
                    photo: source,
                    photo_data: response.data
                });
            }
        });

        Requestor.upload(
            face_api_base_url + '/face/v1.0/detect',
            api_key,
            this.state.photo_data
        )
            .then((facedetect_res) => {
                console.log(facedetect_res);

                let face_id = facedetect_res[0].faceId;

                let data = {
                    faceId: face_id,
                    personId: this.state.person_id,
                    personGroupId: gUserInfo.user_name
                }

                Requestor.request(
                    face_api_base_url + '/face/v1.0/verify',
                    'POST',
                    api_key,
                    JSON.stringify(data)
                )
                    .then((verify_res) => {

                        console.log(verify_res);

                        let result = verify_res.isIdentical;
                        let confidece = verify_res.confidence;

                        console.log(result);

                        if(result === true){
                            this.onPressSignScan();
                        }else{
                            alert('Face Authentication Failed');
                        }

                    });

            });

    }


}

