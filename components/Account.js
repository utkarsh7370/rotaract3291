import React, { createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import Pool from "./UserPool";
import { useRouter } from 'next/router';

const AccountContext = createContext();

const Account = (props) => {

    const router = useRouter();

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession((err, session) => {
                if (err) {
                    reject();
                } else {
                    resolve(session);
                }
                });
            } else {
                reject();
            }
        });
    };

    const authenticate = async (Username, Password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({ Username, Pool });

                const authDetails = new AuthenticationDetails({ Username, Password });

                user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    debugger;
                    console.log("onSuccess: ", data);
                    window.location.reload();
                    resolve(data);
                },
                onFailure: (err) => {
                    console.error("onFailure: ", err);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    console.log("newPasswordRequired: ", data);
                    resolve(data);
                },
            });
        });
    };

  const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
            window.location.reload();
        }
  };

    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout }}>
            {props.children}
        </AccountContext.Provider>
    );
};
export { Account, AccountContext };
