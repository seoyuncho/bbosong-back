import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Store } from 'src/store/entity/store.entity';

@Entity()
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tag_name: string;

  @ManyToMany(() => Store, (store) => store.hashtag)
  store: Store[];
}