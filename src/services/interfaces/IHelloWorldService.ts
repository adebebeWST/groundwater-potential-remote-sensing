import { HelloWorldRequestDTO, HelloWorldResponseDTO } from '../../presentation/dto/HelloWorldDTO';

export interface IHelloWorldService {
  processHelloWorld(request: HelloWorldRequestDTO): Promise<HelloWorldResponseDTO>;
}
