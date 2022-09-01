<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220902150516 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE category_virtual_configuration_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE category_virtual_configuration (id INT NOT NULL, category_id VARCHAR(255) NOT NULL, catalog_id INT DEFAULT NULL, localized_catalog_id INT DEFAULT NULL, is_virtual BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_135C00B712469DE2 ON category_virtual_configuration (category_id)');
        $this->addSql('CREATE INDEX IDX_135C00B7CC3C66FC ON category_virtual_configuration (catalog_id)');
        $this->addSql('CREATE INDEX IDX_135C00B74CF5AFB9 ON category_virtual_configuration (localized_catalog_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_virtual_category_id ON category_virtual_configuration (category_id) WHERE ((catalog_id IS NULL) AND (localized_catalog_id IS NULL))');
        $this->addSql('CREATE UNIQUE INDEX unique_virtual_category_id_catalog_id ON category_virtual_configuration (category_id, catalog_id) WHERE ((catalog_id IS NOT NULL) AND (localized_catalog_id IS NULL))');
        $this->addSql('CREATE UNIQUE INDEX unique_virtual_category_id_catalog_id_localized_catalog_id ON category_virtual_configuration (category_id, catalog_id, localized_catalog_id) WHERE ((catalog_id IS NOT NULL) AND (localized_catalog_id IS NOT NULL))');
        $this->addSql('ALTER TABLE category_virtual_configuration ADD CONSTRAINT FK_135C00B712469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_virtual_configuration ADD CONSTRAINT FK_135C00B7CC3C66FC FOREIGN KEY (catalog_id) REFERENCES catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_virtual_configuration ADD CONSTRAINT FK_135C00B74CF5AFB9 FOREIGN KEY (localized_catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_configuration DROP is_virtual');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE category_virtual_configuration_id_seq CASCADE');
        $this->addSql('DROP TABLE category_virtual_configuration');
        $this->addSql('ALTER TABLE category_configuration ADD is_virtual BOOLEAN DEFAULT NULL');
    }
}
