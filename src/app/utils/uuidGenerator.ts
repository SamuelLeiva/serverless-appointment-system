import { v4 as uuidv4 } from 'uuid';
import { IIdGenerator } from '../../core/ports/idGenerator';

export class UuidGenerator implements IIdGenerator {
    generate(): string {
        return uuidv4();
    }
}