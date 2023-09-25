import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.inteface";
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
    
    private axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const {data} = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error(`This is an error in a get http request in axios, please check the logs`);
        }
    }
}