<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220311161043 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE localized_catalog_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE metadata_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE source_field_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE source_field_label_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE source_field_option_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE source_field_option_label_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE metadata (id INT NOT NULL, entity VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4F143414E284468 ON metadata (entity)');
        $this->addSql('CREATE TABLE source_field (id INT NOT NULL, metadata_id INT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(255) DEFAULT NULL, weight INT DEFAULT NULL, is_searchable BOOLEAN DEFAULT NULL, is_filterable BOOLEAN DEFAULT NULL, is_sortable BOOLEAN DEFAULT NULL, is_spellchecked BOOLEAN DEFAULT NULL, is_used_for_rules BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C2FD9E67DC9EE959 ON source_field (metadata_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_metadata_code ON source_field (name, metadata_id)');
        $this->addSql('CREATE TABLE source_field_label (id INT NOT NULL, catalog_id INT NOT NULL, source_field_id INT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_197F96B3CC3C66FC ON source_field_label (catalog_id)');
        $this->addSql('CREATE INDEX IDX_197F96B37173162 ON source_field_label (source_field_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_catalog_source_field ON source_field_label (catalog_id, source_field_id)');
        $this->addSql('CREATE TABLE source_field_option (id INT NOT NULL, source_field_id INT NOT NULL, position INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A628500A7173162 ON source_field_option (source_field_id)');
        $this->addSql('CREATE TABLE source_field_option_label (id INT NOT NULL, catalog_id INT NOT NULL, source_field_option_id INT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A564F6DACC3C66FC ON source_field_option_label (catalog_id)');
        $this->addSql('CREATE INDEX IDX_A564F6DAE4D8B5EE ON source_field_option_label (source_field_option_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_catalog_source_field_option ON source_field_option_label (catalog_id, source_field_option_id)');
        $this->addSql('ALTER TABLE source_field ADD CONSTRAINT FK_C2FD9E67DC9EE959 FOREIGN KEY (metadata_id) REFERENCES metadata (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_label ADD CONSTRAINT FK_197F96B3CC3C66FC FOREIGN KEY (catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_label ADD CONSTRAINT FK_197F96B37173162 FOREIGN KEY (source_field_id) REFERENCES source_field (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_option ADD CONSTRAINT FK_A628500A7173162 FOREIGN KEY (source_field_id) REFERENCES source_field (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_option_label ADD CONSTRAINT FK_A564F6DACC3C66FC FOREIGN KEY (catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_option_label ADD CONSTRAINT FK_A564F6DAE4D8B5EE FOREIGN KEY (source_field_option_id) REFERENCES source_field_option (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE source_field DROP CONSTRAINT FK_C2FD9E67DC9EE959');
        $this->addSql('ALTER TABLE source_field_label DROP CONSTRAINT FK_197F96B37173162');
        $this->addSql('ALTER TABLE source_field_option DROP CONSTRAINT FK_A628500A7173162');
        $this->addSql('ALTER TABLE source_field_option_label DROP CONSTRAINT FK_A564F6DAE4D8B5EE');
        $this->addSql('DROP SEQUENCE localized_catalog_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE metadata_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE source_field_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE source_field_label_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE source_field_option_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE source_field_option_label_id_seq CASCADE');
        $this->addSql('DROP TABLE metadata');
        $this->addSql('DROP TABLE source_field');
        $this->addSql('DROP TABLE source_field_label');
        $this->addSql('DROP TABLE source_field_option');
        $this->addSql('DROP TABLE source_field_option_label');
    }
}
