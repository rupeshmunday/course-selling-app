class CommonFunctions{
    /**
     * Function to delete json
     * @param obj {Object} the json object to be modified
     * @param paramToAvoid {JSON_obj} the parameters of object to delete
     */
    public cleanJson<T extends object>(obj: T, paramToAvoid: string[]): Partial<T> {
        const result = { ...obj }; // clone to avoid mutating the original object
        for (const key of paramToAvoid) {
            delete (result as any)[key];
        }
        return result;
    }


    /*
    * This function use to set first name, last name and company id in object
    * @param isCreated {Boolean} the request is to create or update data
    * @param user {Object} logged in user object
    * @param data {Object} the body data in which we need to append these params
    */
    public setDefaultAttributes(isCreated: boolean , user: any, data: any) : any {

        data.modBy = {
            id: user.usr_id,
            fN: user.fN,
            lN: user.lN
        };
        data.cmpId = user.cmp_id;
        if (isCreated) {
            data.crtdBy = {
                id: user.usr_id,
                fN: user.fN,
                lN: user.lN
            }
        }
        return data;
    }
}

export default CommonFunctions;

