'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">survey documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AnswerModule.html" data-type="entity-link" >AnswerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AnswerModule-8375c25eb08ffcb6365d01549cacfd0b89740b0832b480489f3745a2fa14e73592c52d43e39146be75ba274ebc4e20570cad18f8c35bdf55298aee8b11eee9d9"' : 'data-target="#xs-injectables-links-module-AnswerModule-8375c25eb08ffcb6365d01549cacfd0b89740b0832b480489f3745a2fa14e73592c52d43e39146be75ba274ebc4e20570cad18f8c35bdf55298aee8b11eee9d9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AnswerModule-8375c25eb08ffcb6365d01549cacfd0b89740b0832b480489f3745a2fa14e73592c52d43e39146be75ba274ebc4e20570cad18f8c35bdf55298aee8b11eee9d9"' :
                                        'id="xs-injectables-links-module-AnswerModule-8375c25eb08ffcb6365d01549cacfd0b89740b0832b480489f3745a2fa14e73592c52d43e39146be75ba274ebc4e20570cad18f8c35bdf55298aee8b11eee9d9"' }>
                                        <li class="link">
                                            <a href="injectables/AnswerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnswerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-264c22299a0f4a4074199a7657d42d2ae87bbf6de2a974bfb80279d9ee34dc02f8c7ed3217a05cd7efbd0425ed93b8ea1545d42a31b3c4d02386026565e7fc01"' : 'data-target="#xs-controllers-links-module-AppModule-264c22299a0f4a4074199a7657d42d2ae87bbf6de2a974bfb80279d9ee34dc02f8c7ed3217a05cd7efbd0425ed93b8ea1545d42a31b3c4d02386026565e7fc01"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-264c22299a0f4a4074199a7657d42d2ae87bbf6de2a974bfb80279d9ee34dc02f8c7ed3217a05cd7efbd0425ed93b8ea1545d42a31b3c4d02386026565e7fc01"' :
                                            'id="xs-controllers-links-module-AppModule-264c22299a0f4a4074199a7657d42d2ae87bbf6de2a974bfb80279d9ee34dc02f8c7ed3217a05cd7efbd0425ed93b8ea1545d42a31b3c4d02386026565e7fc01"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-264c22299a0f4a4074199a7657d42d2ae87bbf6de2a974bfb80279d9ee34dc02f8c7ed3217a05cd7efbd0425ed93b8ea1545d42a31b3c4d02386026565e7fc01"' : 'data-target="#xs-injectables-links-module-AppModule-264c22299a0f4a4074199a7657d42d2ae87bbf6de2a974bfb80279d9ee34dc02f8c7ed3217a05cd7efbd0425ed93b8ea1545d42a31b3c4d02386026565e7fc01"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-264c22299a0f4a4074199a7657d42d2ae87bbf6de2a974bfb80279d9ee34dc02f8c7ed3217a05cd7efbd0425ed93b8ea1545d42a31b3c4d02386026565e7fc01"' :
                                        'id="xs-injectables-links-module-AppModule-264c22299a0f4a4074199a7657d42d2ae87bbf6de2a974bfb80279d9ee34dc02f8c7ed3217a05cd7efbd0425ed93b8ea1545d42a31b3c4d02386026565e7fc01"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ParticipantModule.html" data-type="entity-link" >ParticipantModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ParticipantModule-ced71da91125e914e8766bda0ee1ca61cfa5219b81ea1add6837ec166f52e2e7756b9e16b5d2794cd4ac8eca77d73550188fa88086fc57eb6c4a11e9f465b8ab"' : 'data-target="#xs-injectables-links-module-ParticipantModule-ced71da91125e914e8766bda0ee1ca61cfa5219b81ea1add6837ec166f52e2e7756b9e16b5d2794cd4ac8eca77d73550188fa88086fc57eb6c4a11e9f465b8ab"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ParticipantModule-ced71da91125e914e8766bda0ee1ca61cfa5219b81ea1add6837ec166f52e2e7756b9e16b5d2794cd4ac8eca77d73550188fa88086fc57eb6c4a11e9f465b8ab"' :
                                        'id="xs-injectables-links-module-ParticipantModule-ced71da91125e914e8766bda0ee1ca61cfa5219b81ea1add6837ec166f52e2e7756b9e16b5d2794cd4ac8eca77d73550188fa88086fc57eb6c4a11e9f465b8ab"' }>
                                        <li class="link">
                                            <a href="injectables/ParticipantService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParticipantService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/QuestionModule.html" data-type="entity-link" >QuestionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-QuestionModule-d1b43c7bcb5accf9628e821a84f0e1e1561461a08c5e2862b77705f9876fea01ca75c7721afca020655e14ae3c073c16835e638daf11c7943314877f3ecaef7b"' : 'data-target="#xs-injectables-links-module-QuestionModule-d1b43c7bcb5accf9628e821a84f0e1e1561461a08c5e2862b77705f9876fea01ca75c7721afca020655e14ae3c073c16835e638daf11c7943314877f3ecaef7b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QuestionModule-d1b43c7bcb5accf9628e821a84f0e1e1561461a08c5e2862b77705f9876fea01ca75c7721afca020655e14ae3c073c16835e638daf11c7943314877f3ecaef7b"' :
                                        'id="xs-injectables-links-module-QuestionModule-d1b43c7bcb5accf9628e821a84f0e1e1561461a08c5e2862b77705f9876fea01ca75c7721afca020655e14ae3c073c16835e638daf11c7943314877f3ecaef7b"' }>
                                        <li class="link">
                                            <a href="injectables/QuestionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuestionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResponseAnswerModule.html" data-type="entity-link" >ResponseAnswerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ResponseAnswerModule-cfe78f8c92a94a4c4d8e348c23165e767240f538ddbbbbafae695574b664cbae262d69880384dd324ec897e31cfece78f7192c669ea995aab5be8764a3db46e1"' : 'data-target="#xs-injectables-links-module-ResponseAnswerModule-cfe78f8c92a94a4c4d8e348c23165e767240f538ddbbbbafae695574b664cbae262d69880384dd324ec897e31cfece78f7192c669ea995aab5be8764a3db46e1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResponseAnswerModule-cfe78f8c92a94a4c4d8e348c23165e767240f538ddbbbbafae695574b664cbae262d69880384dd324ec897e31cfece78f7192c669ea995aab5be8764a3db46e1"' :
                                        'id="xs-injectables-links-module-ResponseAnswerModule-cfe78f8c92a94a4c4d8e348c23165e767240f538ddbbbbafae695574b664cbae262d69880384dd324ec897e31cfece78f7192c669ea995aab5be8764a3db46e1"' }>
                                        <li class="link">
                                            <a href="injectables/ResponseAnswerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseAnswerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResponseModule.html" data-type="entity-link" >ResponseModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ResponseModule-5cb33df8587fcd6b788997cbc9d8815bf3d307f6582b3ea47210ccb6ed962fe4bfd5940db3429307396066f4f05bd38f813aadcc3ff896890f2718ae753e626f"' : 'data-target="#xs-injectables-links-module-ResponseModule-5cb33df8587fcd6b788997cbc9d8815bf3d307f6582b3ea47210ccb6ed962fe4bfd5940db3429307396066f4f05bd38f813aadcc3ff896890f2718ae753e626f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResponseModule-5cb33df8587fcd6b788997cbc9d8815bf3d307f6582b3ea47210ccb6ed962fe4bfd5940db3429307396066f4f05bd38f813aadcc3ff896890f2718ae753e626f"' :
                                        'id="xs-injectables-links-module-ResponseModule-5cb33df8587fcd6b788997cbc9d8815bf3d307f6582b3ea47210ccb6ed962fe4bfd5940db3429307396066f4f05bd38f813aadcc3ff896890f2718ae753e626f"' }>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResponseQuestionModule.html" data-type="entity-link" >ResponseQuestionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ResponseQuestionModule-fe7a9fe9f35d11e464e6eff41163dd9983a6abe07aba17a67000a851655af99f39d0a2973565eaafbe28900809e76754a23d3948c6f84790e8086ffce74b4e24"' : 'data-target="#xs-injectables-links-module-ResponseQuestionModule-fe7a9fe9f35d11e464e6eff41163dd9983a6abe07aba17a67000a851655af99f39d0a2973565eaafbe28900809e76754a23d3948c6f84790e8086ffce74b4e24"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResponseQuestionModule-fe7a9fe9f35d11e464e6eff41163dd9983a6abe07aba17a67000a851655af99f39d0a2973565eaafbe28900809e76754a23d3948c6f84790e8086ffce74b4e24"' :
                                        'id="xs-injectables-links-module-ResponseQuestionModule-fe7a9fe9f35d11e464e6eff41163dd9983a6abe07aba17a67000a851655af99f39d0a2973565eaafbe28900809e76754a23d3948c6f84790e8086ffce74b4e24"' }>
                                        <li class="link">
                                            <a href="injectables/ResponseQuestionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseQuestionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SurveyModule.html" data-type="entity-link" >SurveyModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SurveyModule-5b2473c9026b0fa4e94e25811fe43a5cce71f8c1f4f4de7188d8bea8280a64b3de0f46879e9294b556febee3deff2ab69a570bd75cc4dd37cef715cb5ca38629"' : 'data-target="#xs-injectables-links-module-SurveyModule-5b2473c9026b0fa4e94e25811fe43a5cce71f8c1f4f4de7188d8bea8280a64b3de0f46879e9294b556febee3deff2ab69a570bd75cc4dd37cef715cb5ca38629"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SurveyModule-5b2473c9026b0fa4e94e25811fe43a5cce71f8c1f4f4de7188d8bea8280a64b3de0f46879e9294b556febee3deff2ab69a570bd75cc4dd37cef715cb5ca38629"' :
                                        'id="xs-injectables-links-module-SurveyModule-5b2473c9026b0fa4e94e25811fe43a5cce71f8c1f4f4de7188d8bea8280a64b3de0f46879e9294b556febee3deff2ab69a570bd75cc4dd37cef715cb5ca38629"' }>
                                        <li class="link">
                                            <a href="injectables/ResponseSurveyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseSurveyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SurveyModule.html" data-type="entity-link" >SurveyModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SurveyModule-c29191bbacc84eb2cbf152f9747e48cdfa8effb2d9b1bf63fe76b94995f4174b6f39598bc3a8e9818a74a1b8c5996671f89a37546c893d4aa1fe8456eb9ca764-1"' : 'data-target="#xs-injectables-links-module-SurveyModule-c29191bbacc84eb2cbf152f9747e48cdfa8effb2d9b1bf63fe76b94995f4174b6f39598bc3a8e9818a74a1b8c5996671f89a37546c893d4aa1fe8456eb9ca764-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SurveyModule-c29191bbacc84eb2cbf152f9747e48cdfa8effb2d9b1bf63fe76b94995f4174b6f39598bc3a8e9818a74a1b8c5996671f89a37546c893d4aa1fe8456eb9ca764-1"' :
                                        'id="xs-injectables-links-module-SurveyModule-c29191bbacc84eb2cbf152f9747e48cdfa8effb2d9b1bf63fe76b94995f4174b6f39598bc3a8e9818a74a1b8c5996671f89a37546c893d4aa1fe8456eb9ca764-1"' }>
                                        <li class="link">
                                            <a href="injectables/SurveyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SurveyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Answer.html" data-type="entity-link" >Answer</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Participant.html" data-type="entity-link" >Participant</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Question.html" data-type="entity-link" >Question</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Response.html" data-type="entity-link" >Response</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ResponseAnswer.html" data-type="entity-link" >ResponseAnswer</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ResponseQuestion.html" data-type="entity-link" >ResponseQuestion</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ResponseSurvey.html" data-type="entity-link" >ResponseSurvey</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Survey.html" data-type="entity-link" >Survey</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Answer.html" data-type="entity-link" >Answer</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnswerResolver.html" data-type="entity-link" >AnswerResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAnswerInput.html" data-type="entity-link" >CreateAnswerInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateParticipantInput.html" data-type="entity-link" >CreateParticipantInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateQuestionInput.html" data-type="entity-link" >CreateQuestionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResponseAnswerInput.html" data-type="entity-link" >CreateResponseAnswerInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResponseInput.html" data-type="entity-link" >CreateResponseInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResponseQuestionInput.html" data-type="entity-link" >CreateResponseQuestionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResponseSurveyInput.html" data-type="entity-link" >CreateResponseSurveyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSurveyInput.html" data-type="entity-link" >CreateSurveyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateScalar.html" data-type="entity-link" >DateScalar</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateScalar-1.html" data-type="entity-link" >DateScalar</a>
                            </li>
                            <li class="link">
                                <a href="classes/Participant.html" data-type="entity-link" >Participant</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipantResolver.html" data-type="entity-link" >ParticipantResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Question.html" data-type="entity-link" >Question</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionResolver.html" data-type="entity-link" >QuestionResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Response.html" data-type="entity-link" >Response</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseAnswer.html" data-type="entity-link" >ResponseAnswer</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseAnswerResolver.html" data-type="entity-link" >ResponseAnswerResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseQuestion.html" data-type="entity-link" >ResponseQuestion</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseQuestionResolver.html" data-type="entity-link" >ResponseQuestionResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseResolver.html" data-type="entity-link" >ResponseResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseSurvey.html" data-type="entity-link" >ResponseSurvey</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseSurveyResolver.html" data-type="entity-link" >ResponseSurveyResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Survey.html" data-type="entity-link" >Survey</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyResolver.html" data-type="entity-link" >SurveyResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAnswerInput.html" data-type="entity-link" >UpdateAnswerInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateParticipantInput.html" data-type="entity-link" >UpdateParticipantInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateQuestionInput.html" data-type="entity-link" >UpdateQuestionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResponseInput.html" data-type="entity-link" >UpdateResponseInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSurveyInput.html" data-type="entity-link" >UpdateSurveyInput</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ResponseAnswerService.html" data-type="entity-link" >ResponseAnswerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResponseSurveyService.html" data-type="entity-link" >ResponseSurveyService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});