import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Hashtag } from 'src/hashtag/entity/hashtag.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  category: string;

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.store)
  @JoinTable({
    name: 'storehashtag',
    joinColumn: {
      name: 'storeId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'hashtagId',
      referencedColumnName: 'id',
    },
  })
  hashtag: Hashtag[];
}