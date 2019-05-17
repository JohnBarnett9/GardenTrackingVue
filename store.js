export default new Vuex.Store({
    state: {
        count: 0,
        rowsOfTable: [],
        dropTablesCreateTablesOutput: [],
        minimalDataOutput: [],
        typeList: [],
        checkboxedType: '',//Ex: Bean
        checkboxedTypeId: 0, //Ex: PK of Bean is 1
        tagList: [], //list of tags in right column of TypeTag page
        tagsOfType: [], //list of tags for the type selected in middle column
        tagsNotOfType: [], //middle column, list of tags not assigned to selected Type
        seedTypeList: [], //left column of Seed page
        allTagsOfAllTypes: [], //array of objects, each object is a type, each object has array of tags of that type
        allSeedTableData: {
            tableHeaders: [],
            tableRows: []
        } //prop with reusabletable
    },
    mutations: {
        increment: (state) => {
            console.log("in store in mutations in increment");
            state.count++;
        },
        decrement: (state) => {
            state.count--;
        },
        setRowsOfTable: (state, payload) => {
            state.rowsOfTable = payload.param1;
        },
        dropTablesCreateTables: (state, payload) => {
            console.log("in mutation dropTablesCreateTables mutation");
            state.dropTablesCreateTablesOutput = payload.param1
        },
        addMinimalData: (state, payload) => {
            console.log("in addMinimalData mutation");
            state.minimalDataOutput = payload.param1
        },
        setTypeList: (state, payload) => {
            state.typeList = payload.param1
            //this.state.typeList = payload.param1
        },
        setTagList: (state, payload) => {
            state.tagList = payload.param1
        },
        setTagsOfType: (state, payload) => {
            state.tagsOfType = payload.param1
        },
        setTagsNotOfType: (state, payload) => {
            state.tagsNotOfType = payload.param1
        },
        setSeedList: (state, payload) => {
            state.allSeedTableData.tableRows = payload.param1
        },
        setSeedTableHeaders: (state, payload) => {
            state.allSeedTableData.tableHeaders = payload.param1
        },
        setTypeTagFilter: (state, payload) => {
            state.allTagsOfAllTypes = payload.param1
        }
    },
    actions: {
        setSeedList({commit, state}, payload) {
            axios.get('seedController.php', {
                params: {
                    command:1
                }
            })
            .then((response) => {
                //console.log("in action setSeedList in then");
                //console.log("response.data=");
                //console.dir(response.data);

                this.commit({
                    type: 'setSeedList',
                    param1: response.data
                });
            })
            .catch((error) => {
                console.log("errors of action setTypeList=");
                console.log(error);
            });
        },
        /*
        called from 2 places
        1, typetag.js mounted
        2, action editTypeName .then()
        */
        setTypeList({commit, state}, payload) {
            //console.log("in action setTypeList");
            /*
            console.log("in setTypeList this=");
            console.dir(this);
            */
            axios.get('typeTagController.php', {
                params: {
                    command:1
                }
            })
            .then((response) => {
                //console.log("in action setTypeList in then");
                //console.dir(response.data);

                //load new rows into store.state.rowsOfTable
                this.commit({
                    type: 'setTypeList',
                    param1: response.data
                });
                /*
                console.log("this.state.typeList=");
                console.dir(this.state.typeList[0].column2);
                */
            })
            .catch((error) => {
                console.log("errors of action setTypeList=");
                console.log(error);
            });
        },
        editTypeName({commit, state}, payload){
        //editTypeName(){
            console.log("in action editTypeName");
            
            var paramsToSend = new URLSearchParams();
            paramsToSend.append('command', '2');
            /*
            console.log("payload.typeName=" + payload.typeName);
            console.log("payload.typeId=" + payload.typeId);
            */
            paramsToSend.append('newName', payload.typeName);
            paramsToSend.append('typeId', payload.typeId);
            
            axios.post('typeTagController.php', 
                paramsToSend
            )
            .then((response) => {
                console.log("in action editTypeName in then");
                //console.dir(response.data);

                //load new rows into store.state.rowsOfTable
                console.log("store.js: dispatch setTypeList");
                this.dispatch('setTypeList'); //reload list of Types
            })
            .catch((error) => {
                console.log("errors of action editTypeName=");
                console.log(error);
            });
        },
        addType({commit, state}, payload) {
            console.log("in addType");
            /*
            console.log("payload=");
            console.dir(payload.newType);
            */
            var paramsToSend = new URLSearchParams();
            paramsToSend.append('command', '3');
            paramsToSend.append('newType', payload.newType);

            axios.post('typeTagController.php', 
                paramsToSend
            )
            .then((response) => {
                console.log("response data=");
                console.dir(response.data);
                this.dispatch('setTypeList'); //refresh displayed list of Types

            })
            .catch((error) => {
                console.log("errors of action addType=");
                console.log(error);
            });

        }
        ,
        deleteType({commit, state}, payload) {
            console.log("in deleteType");
            console.log("payload=");
            console.dir(payload);

            var paramsToSend = new URLSearchParams();
            paramsToSend.append('command', '4');
            paramsToSend.append('deleteTypeId', payload.typeId);

            axios.post('typeTagController.php', 
                paramsToSend
            )
            .then((response) => {
                console.log("in deleteType then response data=");
                console.dir(response.data);
                this.dispatch('setTypeList'); //refresh displayed list of Types

            })
            .catch((error) => {
                console.log("errors of action deleteType=");
                console.log(error);
            });


        },
        setTagList({commit, state}, payload) {
            //console.log("in action setTagList");
            axios.get('typeTagController.php', {
                params: {
                    command:5
                }
            })
            .then((response) => {
                //console.log("in action setTagList in then");

                this.commit({
                    type: 'setTagList',
                    param1: response.data
                });
            })
            .catch((error) => {
                console.log("errors of action setTagList=");
                console.log(error);
            });
        }
        ,
        assignedTagsForThisType({commit, state}, payload) {
            console.log("in action assignedTagsForThisType");
            axios.get('typeTagController.php', {
                params: {
                    command:6,
                    typeId:payload.typeId
                }
            })
            .then((response) => {
                console.log("in action assignedTagsForThisType in then");
                //console.log("assignedTagsForThisType response data = ");
                //console.dir(response.data);
                this.commit({
                    type: 'setTagsOfType',
                    param1: response.data
                });
                
            })
            .catch((error) => {
                console.log("errors of action assignedTagsForThisType=");
                console.log(error);
            });
        },
        tagsNotAssignedToThisType({commit, state}, payload) {
            console.log("in action assignedTagsForThisType");
            axios.get('typeTagController.php', {
                params: {
                    command:7,
                    typeId:payload.typeId
                }
            })
            .then((response) => {
                console.log("in action tagsNotAssignedToThisType in then");
                //console.log("tagsNotAssignedToThisType response data = ");
                //console.dir(response.data);
                this.commit({
                    type: 'setTagsNotOfType',
                    param1: response.data
                });
                
            })
            .catch((error) => {
                console.log("errors of action tagsNotAssignedToThisType=");
                console.log(error);
            });            
        }
        ,
        dropTablesCreateTables({commit, state}, payload) {
            console.log("in action dropTablesCreateTables");

            var paramsToSend = new URLSearchParams();
            paramsToSend.append('adminDatabaseCommand', '1');
            /*
            */
            axios.post('adminDatabaseFunctions.php', paramsToSend)
            .then((response) => {
                console.log("response.data=");
                console.log(response.data);
                //store.state.dropTablesCreateTablesOutput = response.data
                this.commit({
                  type: 'dropTablesCreateTables',
                  param1: response.data
                });             
                console.log("in action store.state.dropTablesCreateTablesOutput=");
                console.log(this.state.dropTablesCreateTablesOutput);
                //load new rows into store.state.rowsOfTable
                //store.dispatch('setRowsOfTable');
            })
            .catch((error) => {
                console.log("errors of action dropTablesCreateTables=");
                console.log(error);
            });
            
          
        },
        addMinimalData({commit, state}, payload) {
            var paramsToSend = new URLSearchParams();
            paramsToSend.append('adminDatabaseCommand', '2');
            axios.post('adminDatabaseFunctions.php', paramsToSend)
            .then((response) => {
                console.log("response.data=");
                console.log(response.data);
                //store.state.minimalDataOutput = response.data
                this.commit({
                    type: 'addMinimalData',
                    param1: response.data
                });
                console.log("in action store.state.minimalDataOutput=");
                console.log(this.state.minimalDataOutput);
                //load new rows into store.state.rowsOfTable
                //store.dispatch('setRowsOfTable');
            })
            .catch((error) => {
                console.log("errors of action addMinimalData=");
                console.log(error);
            });
        },
        //one of the 3 events happened in the Type Tag filtering on seed page
        updateSeedSearchResults({commit, state}, payload) {
            /*
            console.log("in updateSeedSearchResults");
            console.log("payload.typePK=");
            console.dir(payload.typePK);
            console.log("payload.tagPKs");
            console.dir(payload.tagPKs);
            */
            axios.get('seedController.php', {
                params:{
                    command:3,
                    typePK:payload.typePK,
                    tagPKs:payload.tagPKs
                }
            })
            .then((response) => {
                console.log("response.data=");
                console.log(response.data);
                this.commit({
                    type:'setSeedList',
                    param1:response.data
                });
            })
            .catch((error) => {
                console.log("errors of action updateSeedSearchResults=");
                console.log(error);
            });
        },
        //get headers of reusable seed table
        setSeedTableHeaders({commit, state}, payload) {
            console.log("in action setSeedTableHeaders");
            axios.get('seedController.php',{params:{command:4}})
            .then((response) => {
                //console.log("in axios get seed headers in then");
                //console.log("response.data=");
                //console.dir(response.data);
                this.commit({
                    type:'setSeedTableHeaders',
                    param1:response.data
                });
            })
            .catch((error) => {
                console.log("errors of action setSeedTableHeaders=");
                console.log(error);
            });

        },
        deleteTagFromType({commit, state}, payload) {
            console.log("in deleteTagFromType");
            var paramsToSend = new URLSearchParams();
            paramsToSend.append('command', 8);
            paramsToSend.append('typePK', payload.typePK);
            paramsToSend.append('tagPK', payload.tagPK);

            axios.post('typeTagController.php', 
                paramsToSend
            )
            .then((response) => {
                //console.log("in action deleteTagFromType() in then");
                //console.dir(response.data);
                
                //reload the assigned tags for this Type
                this.dispatch({
                    type:'assignedTagsForThisType',
                    typeId:payload.typePK
                });                

            })
            .catch((error) => {
                console.log("errors of action deleteTagFromType=");
                console.log(error);
            });
        }
        /**/
        ,
        addTagToType({commit, state}, payload) {
            console.log("in addTagToType");
            console.log("payload.typePK=");
            console.dir(payload.typePK);

            var paramsToSend = new URLSearchParams();
            paramsToSend.append('command', 9);
            paramsToSend.append('typePK', payload.typePK);
            paramsToSend.append('tagPK', payload.tagPK);

            axios.post('typeTagController.php',
                paramsToSend
            )
            .then((response) => {
                console.log("addTagToType response=");
                console.dir(response.data);

                //reload 'Assigned Tags For This Type'
                this.dispatch({
                    type:'assignedTagsForThisType',
                    typeId:payload.typePK
                });

                //reload 'Assign Another Tag to This Type'
                this.dispatch({
                    type:'tagsNotAssignedToThisType',
                    typeId:payload.typePK
                });
            })
            .catch((error) => {
                console.log("errors of action addTagToType=");
                console.log(error);
            });
        },

        //edit Tag name, right column of TypeTag page, triggered from 'Submit Edit'
        editTagName({commit, state}, payload) {
            console.log("payload.tagName=");
            console.dir(payload.tagName);
            var paramsToSend = new URLSearchParams();
            paramsToSend.append('command', 10);
            paramsToSend.append('tagName', payload.tagName);
            paramsToSend.append('tagId', payload.tagId);
            axios.post('typeTagController.php', paramsToSend)
            .then((response) => {
                console.log("in action editTagName response=");
                console.dir(response.data);
                this.dispatch('setTagList');
                /*
                this.commit({
                    type: 'setTagList',
                    param1:response.data
                });
                */
            })
            .catch((error) => {
                console.log("errors of action editTagName=");
                console.log(error);
            });
        },
        //delete tag
        deleteTag({commit, state}, payload) {
            var paramsToSend = new URLSearchParams();
            paramsToSend.append('command', 11);
            paramsToSend.append('tagId', payload.tagId);
            axios.post('typeTagController.php', paramsToSend)
            .then((response) => {
                this.dispatch('setTagList');

                //have 0 Tag radio buttons selected
            })
            .catch((error) => {
                console.log("errors of action deleteTag");
                console.log(error);
            });
        }
        
    }//end of actions
});

